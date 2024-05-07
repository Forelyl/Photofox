import asyncpg as postgres
from typing import Any
import asyncio
from asyncpg.connect_utils import pathlib
from pydantic import BaseModel


class DB:

    def __init__(self, dbname: str, user: str, password: str) -> None:
        self.__PORT = "5432"
        self.__IP = "127.0.0.1"
        self.dbname = dbname
        self.user = user
        self.password = password
    
    async def setup (self):
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        self.database = await postgres.connect(database=self.dbname, user=self.user, password=self.password, port=self.__PORT, host=self.__IP)
        
    async def close(self) -> None:
        await self.database.close()

    async def execute(self, query: str, *args) -> list[str]: 
        result: list[str] = []
        #async with con.transaction():
        
        async with self.database.transaction():
            async for x in self.database.cursor(query, *args):
                result.append(x)
        return result

    @staticmethod
    def process_return(values: list[postgres.Record]) -> list[dict[str, Any]]:
        result: list[dict[str, Any]] = []
            
        for row in values:
            dict_result: dict[str, Any] = {}
            for key in row.keys():
                dict_result[key] = row[key]
            
            result.append(dict_result) 
        return result

class DB_Returns:
    class Hash_and_admin(BaseModel):
        hash: str
        is_admin: bool = False

    class Image(BaseModel):
        id: int
        path: str
    
    class Image_mobile(Image):
        title: str | None
        like_counter: int
        comment_counter: int
        author_id: int
        author_login: str
        author_picture: str | None
        
    class Image_full(Image_mobile):
        description: str | None
        tags: list[str] | None
    




class PhotoFox: 
    # INIT
    def __init__(self) -> None:
        self.__DBNAME   = "photofox";
        self.__USER     = "fox";
        self.__PASSWORD = "qweasd12";    
        self.__DB = DB(self.__DBNAME, self.__USER, self.__PASSWORD)
    
    async def setup(self):
        await self.__DB.setup()
    
    async def close(self):
        await self.__DB.close()

    # SELECT
    # TODO:
    # -4) 🦊 email is exists
    # -3) 🦊 login is exists
    # -2) ##########
    # -1) hash, is_admin - user 
    # 0) 🦊 select image with limit - last
    # 1) 🦊 select image info without counter of reports
    # 2)  select comment with limit without counter of reports - I think that it could be tricky cause we don't neeed just offset we need to also specidfy what object was first when we get data for first time (or for last for 3-rd and so on)
    # 3)  select tag like str
    # 3.1) select tad id by str
    # 4)  select image with subcribed_on
    # 5)  select image with size | None, tag | None, data | None, size_ratio | None, like | None
    # 6)  select image with author
    # 7)  select image with complaints
    # 8)  select profile with complaints
    # 9)  select comments with complaints
    # X)     


    async def select_all_tags(self) -> list[dict[str, Any]]:
        return DB.process_return(await self.__DB.execute("SELECT * FROM tag"))
    
    async def email_exists(self, email: str) -> bool:
        result: list[dict] = DB.process_return(await self.__DB.execute(
        """
        SELECT 
            EXISTS(SELECT 1 FROM "user" WHERE email = $1);
        """, email))

        return result[0]['exists']
    
    async def login_exists(self, login: str) -> bool:
        result: list[dict] = DB.process_return(await self.__DB.execute(
        """
        SELECT 
            EXISTS(SELECT 1 FROM "user" WHERE login = $1);
        """, login))

        return result[0]['exists']

    async def is_admin(self, login: str) -> bool:
        result: list[dict] = DB.process_return(await self.__DB.execute(
        """
        SELECT is_admin FROM "user" WHERE login = $1;
        """, login))

        return result[0]['is_admin']
    
    async def get_hash_and_admin(self, login: str) -> DB_Returns.Hash_and_admin | None:
        query_result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(
        """
        SELECT hash_and_salt, is_admin FROM "user" WHERE login = $1;
        """, login))
        if len(query_result) < 1: return None
        function_result: DB_Returns.Hash_and_admin = DB_Returns.Hash_and_admin(
            hash = query_result[0]["hash_and_salt"], 
            is_admin = query_result[0]["is_admin"]
        )

        return function_result

    async def get_images_pc(self, last_image_id: int) -> list[DB_Returns.Image]:
        result: list[dict[str, Any]] = []
        if last_image_id == -1:
            query: str =  """SELECT id, image as path FROM image ORDER BY id DESC LIMIT 30;"""
            result = DB.process_return(await self.__DB.execute(query))
        else:
            query: str =  """SELECT id, image as path FROM image WHERE id < $1 ORDER BY id DESC LIMIT 30;"""
            result = DB.process_return(await self.__DB.execute(query, last_image_id))
        return list(DB_Returns.Image(**x) for x in result)
    
    async def get_images_mobile(self, last_image_id: int) -> list[DB_Returns.Image_mobile]:
        
        if last_image_id == -1:
            query: str = """
            SELECT image.id, image.image as path, image.title, image.like_counter, image.comment_counter,
               "user".id as author_id, "user".login as author_login, "user".profile_image as author_picture
            FROM image JOIN "user" ON image.author_id = "user".id
            ORDER BY id DESC LIMIT 10;
            """    
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query))
        else:
            query: str = """
            SELECT image.id, image.image as path, image.title, image.like_counter, image.comment_counter,
               "user".id as author_id, "user".login as author_login, "user".profile_image as author_picture
            FROM image JOIN "user" ON image.author_id = "user".id
            WHERE image.id < $1 ORDER BY id DESC LIMIT 10;
            """    
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, last_image_id))     
        
        return list(DB_Returns.Image_mobile(**x) for x in result)

    async def get_image(self, image_id: int) -> DB_Returns.Image_full:
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(
        """
        SELECT image.id, image.image as path, image.title, image.like_counter, image.comment_counter, image.description,
               "user".id as author_id, "user".login as author_login, "user".profile_image as author_picture, 
               ARRAY(SELECT tag.title FROM tag WHERE tag.id in (SELECT image_tag.tag_id FROM image_tag WHERE image_tag.image_id = $1)) AS tags
        FROM image JOIN "user" ON image.author_id = "user".id
        WHERE image.id = $1;
        """, image_id))
        
        
        return DB_Returns.Image_full(**result[0])
    
    async def get_subscribed_images_pc(self, user_login: str, last_image_id: int) -> list[DB_Returns.Image]:
        
        if last_image_id == -1:
            query: str = """
            SELECT id, image as path FROM image
                WHERE image.author_id IN
                (SELECT id_subscribed_on FROM subscribe
                    WHERE id_subscriber = (SELECT id FROM "user" WHERE login = $1)
                )
            ORDER BY id DESC LIMIT 30;
            """    
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_login))
        else:
            query: str = """
            SELECT id, image as path FROM image
                WHERE id < $1 AND image.author_id IN
                (SELECT id_subscribed_on FROM subscribe
                    WHERE id_subscriber = (SELECT id FROM "user" WHERE login = $2)
                )
            ORDER BY id DESC LIMIT 30;
            """
            result = DB.process_return(await self.__DB.execute(query, last_image_id, user_login))
        
        return list(DB_Returns.Image(**x) for x in result)

    async def get_subscribed_images_mobile(self, user_login: str, last_image_id: int) -> list[DB_Returns.Image_mobile]:

        if last_image_id == -1:
            query: str = """
            SELECT image.id, image.image as path, image.title, image.like_counter, image.comment_counter,
            "user".id as author_id, "user".login as author_login, "user".profile_image as author_picture 
            FROM image JOIN "user" ON image.author_id = "user".id
                WHERE image.author_id IN 
                (SELECT id_subscribed_on FROM subscribe WHERE id_subscriber = (SELECT id FROM "user" WHERE login = $1)) 
            ORDER BY image.id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_login))
        else:
            query: str = """
            SELECT image.id, image.image as path, image.title, image.like_counter, image.comment_counter,
            "user".id as author_id, "user".login as author_login, "user".profile_image as author_picture 
            FROM image JOIN "user" ON image.author_id = "user".id
                WHERE image.id < $1 AND image.author_id IN 
                (SELECT id_subscribed_on FROM subscribe WHERE id_subscriber = (SELECT id FROM "user" WHERE login = $2)) 
            ORDER BY image.id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, last_image_id, user_login))

        return list(DB_Returns.Image_mobile(**x) for x in result)

    #INSERT
    async def add_admin(self, login: str, email: str, hash_and_salt: str) -> None:
        await self.__DB.execute(
        """
        INSERT INTO "user"(login, email, hash_and_salt, is_admin) VALUES($1, $2, $3, $4)
        """, login, email, hash_and_salt, True)
    
    async def add_user(self, login: str, email: str, hash_and_salt: str) -> None:
        await self.__DB.execute(
        """
        INSERT INTO "user"(login, email, hash_and_salt) VALUES($1, $2, $3)
        """, login, email, hash_and_salt)
    
    #async def add_image(self)
    
    #DELETE

    #UPDATE

async def print_XD(db: PhotoFox):
    value = await db.select_all_tags()
    print(value)


db = PhotoFox()
# asyncio.run(print_XD(db))
# asyncio.run(db.close())