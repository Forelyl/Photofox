import asyncpg as postgres
from typing import Any
import asyncio
from asyncpg.connect_utils import pathlib
from pydantic import BaseModel
from pydantic_core.core_schema import NoInfoValidatorFunction


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
    
    class Image_reported(Image):
        title: str | None
        like_counter: int
        comment_counter: int
        report_counter: int
        author_login: str
        description: str | None
        tags: list[str] | None

    class Image_full(Image_mobile):
        description: str | None
        tags: list[str] | None
    
    class Comment(BaseModel):
        id: int
        description: str
        author_picture: str | None = None
        login: str
    
    class Comment_reported(BaseModel):
        id: int
        description: str
        
        commented_picture: str # link
        comment_author_id: int 
        comment_author_login: str
        amount_of_reports: int
    
    class Profile(BaseModel):
        id: int
        login: str
        profile_image: str | None
        is_blocked: bool = False

    class Profile_reported(BaseModel):
        id: int
        login: str
        profile_image: str | None
        description: str | None

        report_comment_counter: int
        report_image_counter: int
        report_profile_counter: int
        subscribed_on: int
        subscribers: int

        report_score: float
        is_blocked: bool
        




class PhotoFox: 
    # INIT
    def __init__(self) -> None:
        self.__DBNAME   = "photofox";
        self.__USER     = "fox";
        self.__PASSWORD = "1234";
        self.__DB = DB(self.__DBNAME, self.__USER, self.__PASSWORD)
    
    async def setup(self):
        await self.__DB.setup()
    
    async def close(self):
        await self.__DB.close()

    # SELECT
    # TODO:
    # -4) 🦊 email is exists
    # -3) 🦊 login is exists
    # -1) 🦊 hash, is_admin - user 
    # 0)  🦊 select image with limit - last
    # 1)  🦊 select image info without counter of reports
    # 2)  🦊 select comment with limit without counter of reports
    # 3)  select tag like str
    # 4)  delete tag (admin privilege)
    # 5)  🦊 insert tag
    # 6)  🦊 select image with subcribed_on
    # 7)  select image with size | None, tag | None, data | None, size_ratio | None, like | None
    # 8)  select image with author
    # 9)  change values of image 
    # 10) 🦊 select image with complaints
    # 11) 🦊 select profile with complaints
    # 12) 🦊 select comments with complaints
    # 13) 🦊 add subscribe and unsubscribe   
    # 14) tag to id


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

    async def get_hash_and_admin_by_id(self, user_id: int) -> DB_Returns.Hash_and_admin | None:
        query_result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(
        """
        SELECT hash_and_salt, is_admin FROM "user" WHERE id = $1;
        """, user_id))
        if len(query_result) < 1: return None
        function_result: DB_Returns.Hash_and_admin = DB_Returns.Hash_and_admin(
            hash = query_result[0]["hash_and_salt"], 
            is_admin = query_result[0]["is_admin"]
        )

        return function_result

    async def get_images_pc(self, last_image_id: int) -> list[DB_Returns.Image]:
        result: list[dict[str, Any]] = []
        if last_image_id == -1:
            query: str =  """SELECT id, image_url as path FROM image WHERE NOT (SELECT is_blocked FROM "user" WHERE "user".id = author_id) ORDER BY id DESC LIMIT 30;"""
            result = DB.process_return(await self.__DB.execute(query))
        else:
            query: str =  """SELECT id, image_url as path FROM image WHERE id < $1 AND NOT (SELECT is_blocked FROM "user" WHERE "user".id = author_id) ORDER BY id DESC LIMIT 30;"""
            result = DB.process_return(await self.__DB.execute(query, last_image_id))
        return list(DB_Returns.Image(**x) for x in result)
    
    async def get_images_mobile(self, last_image_id: int) -> list[DB_Returns.Image_mobile]:
        
        if last_image_id == -1:
            query: str = """
            SELECT image.id, image.image_url as path, image.title, image.like_counter, image.comment_counter,
               "user".id as author_id, "user".login as author_login, "user".profile_image_url as author_picture
            FROM image JOIN "user" ON image.author_id = "user".id WHERE NOT "user".is_blocked 
            ORDER BY id DESC LIMIT 10;
            """    
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query))
        else:
            query: str = """
            SELECT image.id, image.image_url as path, image.title, image.like_counter, image.comment_counter,
               "user".id as author_id, "user".login as author_login, "user".profile_image_url as author_picture
            FROM image JOIN "user" ON image.author_id = "user".id
            WHERE image.id < $1 AND NOT "user".is_blocked ORDER BY id DESC LIMIT 10;
            """    
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, last_image_id))     
        
        return list(DB_Returns.Image_mobile(**x) for x in result)

    async def get_image(self, image_id: int) -> DB_Returns.Image_full:
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(
        """
        SELECT image.id, image.image_url as path, image.title, image.like_counter, image.comment_counter, image.description,
               "user".id as author_id, "user".login as author_login, "user".profile_image_url as author_picture,
               ARRAY(SELECT tag.title FROM tag WHERE tag.id in (SELECT image_tag.tag_id FROM image_tag WHERE image_tag.image_id = $1)) AS tags
        FROM image JOIN "user" ON image.author_id = "user".id
        WHERE image.id = $1 AND NOT "user".is_blocked;
        """, image_id))
        
        
        return DB_Returns.Image_full(**result[0])
    
    async def get_subscribed_images_pc(self, id_user: int, last_image_id: int) -> list[DB_Returns.Image]:
        
        if last_image_id == -1:
            query: str = """
            SELECT id, image_url as path FROM image
                WHERE image.author_id IN
                (SELECT id_subscribed_on FROM subscribe
                    WHERE id_subscriber = $1 
                ) AND NOT (SELECT is_blocked FROM "user" WHERE "user".id = author_id)
            ORDER BY id DESC LIMIT 30;
            """    
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, id_user))
        else:
            query: str = """
            SELECT id, image_url as path FROM image
                WHERE id < $1 AND image.author_id IN
                (SELECT id_subscribed_on FROM subscribe
                    WHERE id_subscriber = $2
                ) AND NOT (SELECT is_blocked FROM "user" WHERE "user".id = author_id)
            ORDER BY id DESC LIMIT 30;
            """
            result = DB.process_return(await self.__DB.execute(query, last_image_id, id_user))
        
        return list(DB_Returns.Image(**x) for x in result)


    async def get_subscribed_images_mobile(self, id_user: int, last_image_id: int) -> list[DB_Returns.Image_mobile]:

        if last_image_id == -1:
            query: str = """
            SELECT image.id, image.image_url as path, image.title, image.like_counter, image.comment_counter,
            "user".id as author_id, "user".login as author_login, "user".profile_image_url as author_picture 
            FROM image JOIN "user" ON image.author_id = "user".id
                WHERE image.author_id IN 
                (SELECT id_subscribed_on FROM subscribe WHERE id_subscriber = $1) AND NOT "user".is_blocked
            ORDER BY image.id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, id_user))
        else:
            query: str = """
            SELECT image.id, image.image_url as path, image.title, image.like_counter, image.comment_counter,
            "user".id as author_id, "user".login as author_login, "user".profile_image_url as author_picture 
            FROM image JOIN "user" ON image.author_id = "user".id
                WHERE image.id < $1 AND image.author_id IN 
                (SELECT id_subscribed_on FROM subscribe WHERE id_subscriber = $2) AND NOT "user".is_blocked
            ORDER BY image.id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, last_image_id, id_user))

        return list(DB_Returns.Image_mobile(**x) for x in result)


    async def get_like_on_image(self, id_user: int, id_image: int) -> bool:
        query: str = """
        SELECT * FROM "like" WHERE $2 = id_image AND $1 = id_user;
        """
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, id_user, id_image))
        return len(result) == 1
    

    async def get_last_comments(self, id_image: int, last_id: int) -> list[DB_Returns.Comment]:
        
        if last_id == -1:
            query: str = """
            SELECT comment.id as id, comment.description as description, "user".profile_image_url as author_picture, "user".login as login
            FROM comment JOIN "user" ON comment.user_id = "user".id
            WHERE comment.image_id = $1 AND NOT "user".is_blocked
            ORDER BY comment.id DESC LIMIT 10
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, id_image))
        else:
            query: str = """
            SELECT comment.id as id, comment.description as description, "user".profile_image_url as author_picture, "user".login as login
            FROM comment JOIN "user" ON comment.user_id = "user".id
            WHERE comment.image_id = $1 AND comment.id < $2 AND NOT "user".is_blocked
            ORDER BY comment.id DESC LIMIT 10
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, id_image, last_id))
        
        return list(DB_Returns.Comment(**x) for x in result)

    
    async def get_image_path_by_id(self, image_id: int, author_id: int) -> tuple[str, bool]:
        query: str = """
        SELECT dropbox_path FROM image WHERE id = $1 AND author_id = $2;
        """
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, image_id, author_id))

        if len(result) == 0:
            return ("", False)
        else:
            return (result[0]["dropbox_path"], True)

    async def get_avatar_path_by_id(self, user_id) -> str:
        query: str = 'SELECT dropbox_path FROM "user" WHERE id = $1;'
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_id))

        if result[0]["dropbox_path"] is None:
            return ""
        else:
            return result[0]["dropbox_path"]
    
    async def login_to_id(self, login: str) -> int:
        query: str = 'SELECT id FROM "user" WHERE login = $1;'

        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, login))
        
        return result[0]["id"]
        
    async def get_reported_comments_sorted_by_reports(self, last_comment_id: int) -> list[DB_Returns.Comment_reported]:
        if last_comment_id == -1:
            query: str = """
            SELECT comment.id as id, comment.description as description, comment.report_counter as amount_of_reports,
                   comment.user_id as comment_author_id, 
                   image.image_url as commented_picture, "user".login as comment_author_login
            FROM comment 
            JOIN image ON comment.image_id = image.id
            JOIN "user" ON comment.user_id = "user".id
            WHERE comment.report_counter > 0
            ORDER BY amount_of_reports DESC LIMIT 10;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query))
        else:
            query: str = """
            SELECT comment.id as id, comment.description as description, comment.report_counter as amount_of_reports,
                   comment.user_id as comment_author_id, 
                   image.image_url as commented_picture, "user".login as comment_author_login
            FROM comment 
            JOIN image ON comment.image_id = image.id
            JOIN "user" ON comment.user_id = "user".id
            WHERE comment.report_counter > 0 AND comment.id < $1
            ORDER BY amount_of_reports DESC LIMIT 10;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, last_comment_id))

        return list(DB_Returns.Comment_reported(**x) for x in result)
        
    async def get_reported_images_sorted_by_reports(self, last_image_id: int) -> list[DB_Returns.Image_reported]:
        if last_image_id == -1:
            query: str = """
            SELECT image.id as id, image.image_url as path, image.title as title, like_counter, comment_counter, image.report_counter,
                   image.description, 
                   ARRAY(SELECT tag.title FROM tag WHERE tag.id in (SELECT image_tag.tag_id FROM image_tag WHERE image_tag.image_id = image.id)) AS tags,
                   login as author_login 
            FROM image
            JOIN "user" ON image.author_id = "user".id
            WHERE report_counter > 0
            ORDER BY report_counter DESC LIMIT 10;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query))
        else:
            query: str = """
            SELECT image.id as id, image.image_url as path, image.title as title, like_counter, comment_counter, image.report_counter,
                   image.description, 
                   ARRAY(SELECT tag.title FROM tag WHERE tag.id in (SELECT image_tag.tag_id FROM image_tag WHERE image_tag.image_id = image.id)) AS tags,
                   login as author_login
            FROM image
            JOIN "user" ON image.author_id = "user".id
            WHERE report_counter > 0 AND image.id < $1
            ORDER BY report_counter DESC LIMIT 10;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, last_image_id))

        return list(DB_Returns.Image_reported(**x) for x in result)
    
    async def get_reported_profiles_sorted_by_report_score(self, last_profile_id: int) -> list[DB_Returns.Profile_reported]:
        if last_profile_id == -1:
            query: str = """
            SELECT id, login, profile_image_url as profile_image, description, amount_of_complaints_on_comment as report_comment_counter,
                   amount_of_complaints_on_image as report_image_counter, amount_of_complaints_on_profile as report_profile_counter,
                   subscribed as subscribed_on, subscribers, complaint_score as report_score, is_blocked
            FROM "user"
            WHERE complaint_score > 0 AND NOT is_admin
            ORDER BY complaint_score DESC LIMIT 10;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query))
        else:
            query: str = """
            SELECT id, login, profile_image_url as profile_image, description, amount_of_complaints_on_comment as report_comment_counter,
                   amount_of_complaints_on_image as report_image_counter, amount_of_complaints_on_profile as report_profile_counter,
                   subscribed as subscribed_on, subscribers, complaint_score as report_score, is_blocked
            FROM "user"
            WHERE id < $1 AND complaint_score > 0 AND NOT is_admin
            ORDER BY complaint_score DESC LIMIT 10;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, last_profile_id))

        return list(DB_Returns.Profile_reported(**x) for x in result)
    
    async def check_bloked(self, user_id: int) -> bool:
        query: str = """SELECT is_blocked FROM "user" WHERE id = $1"""
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_id))
        
        return result[0]["is_blocked"]

    async def get_subscribed_on_profiles(self, user_id: int, last_profile_id: int) -> list[DB_Returns.Profile]:
        if last_profile_id == -1:
            query: str = """
            SELECT id, login, profile_image_url as profile_image, is_blocked
            FROM "user"
            WHERE id IN (SELECT id_subscribed_on FROM subscribe WHERE id_subscriber = $1)
            ORDER BY id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_id))
        else:
            query: str = """
            SELECT id, login, profile_image_url as profile_image, is_blocked
            FROM "user"
            WHERE id IN (SELECT id_subscribed_on FROM subscribe WHERE id_subscriber = $1 AND id_subscribed_on < $2)
            ORDER BY id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_id, last_profile_id))

        return list(DB_Returns.Profile(**x) for x in result)

    async def get_subscribers_on_profiles(self, user_id: int, last_profile_id: int) -> list[DB_Returns.Profile]:
        if last_profile_id == -1:
            query: str = """
            SELECT id, login, profile_image_url as profile_image
            FROM "user"
            WHERE id IN (SELECT id_subscriber FROM subscribe WHERE id_subscribed_on = $1) AND NOT is_blocked
            ORDER BY id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_id))
        else:
            query: str = """
            SELECT id, login, profile_image_url as profile_image
            FROM "user"
            WHERE id IN (SELECT id_subscriber FROM subscribe WHERE id_subscribed_on = $1 AND id_subscriber < $2) AND NOT is_blocked
            ORDER BY id DESC LIMIT 30;
            """
            result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_id, last_profile_id))

        return list(DB_Returns.Profile(**x) for x in result)
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
    

    async def add_image(self, id_user: int, share_link: str, path: str, title: str, description: str, download_permission: bool, width: int, height: int) -> int:
        await self.__DB.execute(
        """
        INSERT INTO image(author_id, adding_date, image_url, dropbox_path, title, description, download_permission, width, height) VALUES(
            $1, NOW(), $2, $3, $4, $5, $6, $7, $8
        );
        """, id_user, share_link, path, title, description, download_permission, width, height)

        return self.__DB.process_return(await self.__DB.execute(
        """
        SELECT id FROM image WHERE author_id = $1 AND image_url = $2;
        """, id_user, share_link))[0]['id']
    

    async def add_like(self, id_user: int, id_image: int) -> None:
        await self.__DB.execute('INSERT INTO "like"(id_user, id_image) VALUES($1, $2);', id_user, id_image)
    

    async def add_comment(self, id_user: int, id_image: int, description: str) -> None:
        await self.__DB.execute('INSERT INTO comment(user_id, image_id, description, adding_date) VALUES($1, $2, $3, NOW());', id_user, id_image, description)

    async def add_complaint_image(self, id_user: int, id_image: int) -> None:
        await self.__DB.execute('INSERT INTO complaint_image(id_user, id_image) VALUES($1, $2);', id_user, id_image)

    async def add_complaint_comment(self, id_user: int, id_comment: int) -> None:
        await self.__DB.execute('INSERT INTO complaint_comment(id_user, id_comment) VALUES($1, $2);', id_user, id_comment)

    async def add_complaint_profile(self, id_user: int, id_profile_owner: int) -> None:
        await self.__DB.execute('INSERT INTO complaint_profile(id_user, id_profile_owner) VALUES($1, $2);', id_user, id_profile_owner)

    async def add_subscribe(self, id_subscriber: int, id_subscibed_on: int) -> None:
        await self.__DB.execute('INSERT INTO subscribe(id_subscriber, id_subscribed_on) VALUES($1, $2);', id_subscriber, id_subscibed_on)

    async def add_tag(self, title: str) -> None:
        await self.__DB.execute('INSERT INTO tag(title) VALUES($1);', title)
        
    async def add_tag_to_image(self, image_id: int, tag_id: list[int]) -> None:
        tags_str: str = ""
        for i in range(len(tag_id)):
            tags_str += "(" + str(image_id) + ", " + str(tag_id[i]) + ")"
            if i != len(tag_id) - 1: tags_str += ", "
        
        await self.__DB.execute('INSERT INTO image_tag(image_id, tag_id) VALUES ' + tags_str + ';')
    
    #DELETE
    async def delete_like(self, id_user: int, id_image: int) -> None:
        await self.__DB.execute('DELETE FROM "like" WHERE id_user = $1 AND id_image = $2;', id_user, id_image)
    

    async def delete_comment(self, id_user: int, id_comment: int) -> None:
        await self.__DB.execute('DELETE FROM comment WHERE id = $1 AND user_id = $2;', id_comment, id_user)


    async def delete_profile(self, id_user: int) -> None:
        await self.__DB.execute('DELETE FROM "user" WHERE id = $1;', id_user)


    async def delete_image(self, id_user: int, id_image: int) -> None:
        await self.__DB.execute('DELETE FROM image WHERE id = $1 AND author_id = $2;', id_image, id_user)
    
    async def delete_tag(self, tag_id: int) -> None:
        await self.__DB.execute('DELETE FROM tag WHERE id = $1', tag_id)

    async def delete_profile_picture(self, id_user: int) -> None:
        await self.__DB.execute('UPDATE "user" SET dropbox_path = NULL, profile_image_url = NULL WHERE id = $1', id_user)

    
    async def delete_all_reports_from_comment(self, id_comment: int) -> None:
        await self.__DB.execute('DELETE FROM complaint_comment WHERE id_comment = $1', id_comment)

    async def delete_all_reports_from_image(self, id_image: int) -> None:
        await self.__DB.execute('DELETE FROM complaint_image WHERE id_image = $1', id_image)

    async def delete_all_reports_from_profile(self, user_id: int) -> None:
        await self.__DB.execute('DELETE FROM complaint_image WHERE id_image IN (SELECT id FROM image WHERE author_id = $1);', user_id)
        await self.__DB.execute('DELETE FROM complaint_comment WHERE id_comment IN (SELECT id FROM comment WHERE user_id = $1);', user_id)
        await self.__DB.execute('DELETE FROM complaint_profile WHERE id_profile_owner = $1;', user_id)
        await self.__DB.execute('UPDATE "user" SET complaint_score = 0 WHERE id = $1;', user_id)
        
    async def delete_subscribe(self, user_id: int, subscribed_on: int) -> None:
        await self.__DB.execute('DELETE FROM subscribe WHERE id_subscriber = $1 AND id_subscribed_on = $2', user_id, subscribed_on)

    #UPDATE
    
    async def update_profile_picture(self, image_path: str, image_url: str, user_id: int) -> None:
        await self.__DB.execute('UPDATE "user" SET dropbox_path = $1, profile_image_url = $2 WHERE id = $3', image_path, image_url, user_id)


    async def update_profile_login(self, new_login: str, user_id: int):
        await self.__DB.execute('UPDATE "user" SET login = $1 WHERE id = $2', new_login, user_id)


    async def update_profile_description(self, new_description: str, user_id: int):
        if len(new_description) == 0:
            await self.__DB.execute('UPDATE "user" SET description = NULL WHERE id = $1', user_id)
        else:
            await self.__DB.execute('UPDATE "user" SET description = $1 WHERE id = $2', new_description, user_id)


    async def update_profile_email(self, new_email: str, user_id: int):
        await self.__DB.execute('UPDATE "user" SET email = $1 WHERE id = $2', new_email, user_id)


    async def update_profile_password(self, new_pass: str, user_id: int):
        await self.__DB.execute('UPDATE "user" SET hash_and_salt = $1 WHERE id = $2', new_pass, user_id)
    
    async def update_block_profile (self, user_id: int):
        await self.__DB.execute('UPDATE "user" SET is_blocked = true WHERE id = $1 AND NOT is_admin', user_id)
    
    async def update_unblock_profile (self, user_id: int):
        await self.__DB.execute('UPDATE "user" SET is_blocked = false WHERE id = $1', user_id)
    

async def print_XD(db: PhotoFox):
    value = await db.select_all_tags()
    print(value)


db = PhotoFox()
# asyncio.run(print_XD(db))
# asyncio.run(db.close())