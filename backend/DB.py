from enum import Enum

import asyncpg as postgres
from typing import Any
import asyncio
from pydantic import BaseModel
from fastapi import HTTPException, status


class DB:

    def __init__(self, dbname: str, user: str, password: str) -> None:
        self.__PORT: str = "5432"
        self.__IP: str = "127.0.0.1"
        self.dbname: str = dbname
        self.user: str = user
        self.password: str = password
        self.__CONNECTION_MIN_SIZE: int = 10
        self.__CONNECTION_MAX_SIZE: int = 100
    
    async def setup (self):
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        self.database_pool = await postgres.create_pool(
            database=self.dbname, 
            user=self.user, 
            password=self.password, 
            port=self.__PORT, 
            host=self.__IP,
            min_size=self.__CONNECTION_MIN_SIZE,
            max_size=self.__CONNECTION_MAX_SIZE)
        
    async def close(self) -> None:
        if self.database_pool is None: raise RuntimeError("Database pool wasn't settuped yet it was attemped to close the pool")
        await self.database_pool.close()

    async def execute(self, query: str, *args) -> list[str]: 
        result: list[str] = []
        #async with con.transaction():
        if self.database_pool is None: raise RuntimeError("Database pool wasn't settuped yet it was attemped to use it")
        
        async with self.database_pool.acquire() as connecion:
            return await connecion.fetch(query, *args)

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
    
    class Image_PC(Image):
        width: int
        height: int
    
    class Image_mobile(Image):
        title: str | None
        like_counter: int
        comment_counter: int
        author_id: int
        author_login: str
        author_picture: str | None
        is_liked: bool | None = None
        is_subscribed: bool | None = None
        is_saved: bool | None = None
    
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

class DB_Models:
    # TODO: add indexes for fast search
    class Image_filters(str, Enum):
        subscribed = 'subscribed',
        saved = 'saved',
        published = 'published',
        liked = 'liked',

        proportionH = 'proportionH',
        proportionS = 'proportionS',
        proportionV = 'proportionV',

        like1k = 'like1k',
        like1k_10k = 'like1k_10k',
        like10k = 'like10k',


        sizeS = 'sizeS',
        sizeM = 'sizeM',
        sizeB = 'sizeB',

        dateN = 'new',
        dateO = 'old'

def one_or_none(elements: set[Any], check_with: set[Any]) -> bool:
    """
    @returns true if there is no such element in elements, that is also in check_with, or only one such
    """
    counter: int = 0
    for element in elements:
        if element in check_with:
            if counter == 1: return False
            counter += 1
    return True

def filters_is_ok (filters: set[DB_Models.Image_filters], user_id: int = -1) -> bool:
    check_with: list[set[DB_Models.Image_filters]] = [
        {DB_Models.Image_filters.proportionV, DB_Models.Image_filters.proportionH, DB_Models.Image_filters.proportionS},
        {DB_Models.Image_filters.like1k, DB_Models.Image_filters.like1k_10k, DB_Models.Image_filters.like10k},
        {DB_Models.Image_filters.sizeS, DB_Models.Image_filters.sizeM, DB_Models.Image_filters.sizeB},
        {DB_Models.Image_filters.published, DB_Models.Image_filters.subscribed},
        {DB_Models.Image_filters.dateN, DB_Models.Image_filters.dateO}
    ]

    for check in check_with:
        if not one_or_none(filters, check): return False

    if (user_id != -1): return True

    check_user_for: set[DB_Models.Image_filters] = {
        DB_Models.Image_filters.subscribed,
        DB_Models.Image_filters.saved,
        DB_Models.Image_filters.liked
    }
    #TODO написати кастомний ерор
    for check in check_user_for:
        if check in filters: return False

    return True


def filters_to_sql (filters: set[DB_Models.Image_filters], user_id: int = -1, last_image_id: int = -1, limit: int = 0) -> str:
    where_query: list[str] = list()

    up_down_filter: str = ""
    order_filter:   str = ""

    if DB_Models.Image_filters.dateO in filters:
        order_filter = f" ORDER BY id ASC LIMIT {limit} "
        up_down_filter = ">"
    else:
        order_filter = f" ORDER BY id DESC LIMIT {limit} "
        up_down_filter = "<"


    last_id_query:       str = "" if last_image_id == -1 else f" AND id {up_down_filter} {last_image_id}"
    # last_image_id_query: str = "" if last_image_id == -1 else f" AND image_id {up_down_filter} {last_image_id}"
    last_id_image_query: str = "" if last_image_id == -1 else f" AND id_image {up_down_filter} {last_image_id}"

    if not filters_is_ok(filters, user_id): return ' (SELECT NOT is_blocked FROM "user" WHERE "user".id=author_id)' + last_id_query + order_filter

    # Add filters =====================================================
    if DB_Models.Image_filters.subscribed in filters:
        where_query.append(f"author_id in (SELECT id_subscribed_on FROM subscribe WHERE id_subscriber={user_id})")
    elif DB_Models.Image_filters.published in filters:
        where_query.append(f"author_id={user_id}")
    if DB_Models.Image_filters.saved in filters:
        where_query.append(f"id in (SELECT id_image FROM saved WHERE id_user={user_id} {last_id_image_query})")
    if DB_Models.Image_filters.liked in filters:
        where_query.append(f"id in (SELECT id_image FROM liked WHERE id_user={user_id} {last_id_image_query})")

    if DB_Models.Image_filters.proportionV in filters:
        where_query.append("width < height")
    elif DB_Models.Image_filters.proportionH in filters:
        where_query.append("width > height")
    elif DB_Models.Image_filters.proportionS in filters:
        where_query.append("width = height")

    if DB_Models.Image_filters.like1k in filters:
        where_query.append("like_counter <= 1000")
    elif DB_Models.Image_filters.like1k_10k in filters:
        where_query.append("like_counter >= 1000 AND like_counter <= 10000")
    elif DB_Models.Image_filters.like10k in filters:
        where_query.append("like_counter >= 10000")

    if DB_Models.Image_filters.sizeS in filters:
        where_query.append("(width <= 500 OR height <= 500)")
    elif DB_Models.Image_filters.sizeM in filters:
        where_query.append("(width >= 500 and width <= 1200) AND (height >= 500 and height <= 1200)")
    elif DB_Models.Image_filters.sizeB in filters:
        where_query.append("(width >= 1200 OR height >= 1200)")


    # Return ==========================================================
    if len(filters) == 0: return ' (SELECT NOT is_blocked FROM "user" WHERE "user".id=author_id)' + last_id_query + order_filter
    
    result: str = ' (SELECT NOT is_blocked FROM "user" WHERE "user".id=author_id)'
    if last_id_query != "": result += last_id_query

    for filter_var in where_query:
        result += " AND " + filter_var

    return result + order_filter

def tags_to_sql(tags: tuple[int]) -> str:
    if len(tags) == 0: return ""
    else:              return f"id IN (SELECT image_id FROM image_tag WHERE tag_id IN {str(tags)}) AND"

class PhotoFox:
    @staticmethod
    def __get_password() -> str:
        result: str = ""
        with open('./database_pass.data', 'r') as file:
            result = file.readline()
            if len(result) == 0: raise RuntimeError("No password in backend/database_pass.data")
        return result

    # INIT
    def __init__(self) -> None:
        self.__DBNAME   = "photofox"
        self.__USER     = "fox"
        self.__PASSWORD = PhotoFox.__get_password()
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
        return DB.process_return(await self.__DB.execute("SELECT * FROM tag;"))
    
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

    async def get_images_pc(self,
                            filters: list[DB_Models.Image_filters],
                            tags: tuple, last_image_id: int, user_id: int = -1) -> list[DB_Returns.Image_PC]:
        tags_str: str = tags_to_sql(tags)
        filters_line: str = filters_to_sql(set(filters), user_id, last_image_id, 30)

        query: str =  f"""
            SELECT id, image_url as path, width, height FROM image 
            WHERE {tags_str} {filters_line};
        """
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query))

        return list(DB_Returns.Image_PC(**x) for x in result)
    
    async def get_images_mobile(self,
                                filters: list[DB_Models.Image_filters],
                                tags: tuple, last_image_id: int, user_id: int = -1) -> list[DB_Returns.Image_mobile]:
        #         is_liked: bool = False
        # is_subscribed: bool = False
        tags_str: str = tags_to_sql(tags)
        filters_line: str = filters_to_sql(set(filters), user_id, last_image_id, 10)
        
        query: str = f"""
        SELECT image.id, image.image_url as path, image.title, image.like_counter, image.comment_counter,
               "user".id as author_id, "user".login as author_login, "user".profile_image_url as author_picture,
               EXISTS(SELECT 1 FROM subscribe WHERE (subscribe.id_subscribed_on=image.author_id AND subscribe.id_subscriber={user_id})) AS is_subscribed,
               EXISTS(SELECT 1 FROM "like" WHERE ("like".id_image=image.id AND "like".id_user={user_id})) AS is_liked,
               EXISTS(SELECT 1 FROM saved WHERE (saved.id_image=image.id AND saved.id_user={user_id})) AS is_saved
        FROM image 
        JOIN "user" ON image.author_id = "user".id 
        WHERE {tags_str} {filters_line};
        """
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query))
        
        return list(DB_Returns.Image_mobile(**x) for x in result)

    async def get_image(self, image_id: int, user_id: int = -1) -> DB_Returns.Image_full:
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(
        f"""
        SELECT image.id, image.image_url as path, image.title, image.like_counter, image.comment_counter, image.description,
               "user".id as author_id, "user".login as author_login, "user".profile_image_url as author_picture,
               ARRAY(SELECT tag.title FROM tag WHERE tag.id in (SELECT image_tag.tag_id FROM image_tag WHERE image_tag.image_id = $1)) AS tags,
               EXISTS(SELECT 1 FROM subscribe WHERE (subscribe.id_subscribed_on=image.author_id AND subscribe.id_subscriber={user_id})) AS is_subscribed,
               EXISTS(SELECT 1 FROM "like" WHERE ("like".id_image=image.id AND "like".id_user={user_id})) AS is_liked
               EXISTS(SELECT 1 FROM saved WHERE (saved.id_image=image.id AND saved.id_user={user_id})) AS is_saved
        FROM image JOIN "user" ON image.author_id = "user".id
        WHERE image.id = $1 AND NOT "user".is_blocked;
        """, image_id))
        

        return DB_Returns.Image_full(**result[0])


    async def get_like_on_image(self, id_user: int, id_image: int) -> tuple[int, bool]:
        # SELECT EXISTS(SELECT 1 FROM "like" WHERE "like".id_image=2 AND "like".id_user=2), like_counter FROM image WHERE id = 134;
        query: str = 'SELECT EXISTS(SELECT 1 FROM "like" WHERE "like".id_image=$1 AND "like".id_user=$2), like_counter FROM image WHERE id = $1;'
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, id_image, id_user))

        if len(result) == 0: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                                 detail={"message" : f"Unknown image with id {id_image}"})
        
        return (result[0]['like_counter'], result[0]['exists'])
    

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

    async def get_user_subscribed(self, user_id: int, author_id: int):
        query: str = "SELECT 1 FROM subscribe WHERE id_subscriber=$1 AND id_subscribed_on=$2;"
        result: list[dict[str, Any]] = DB.process_return(await self.__DB.execute(query, user_id, author_id))
        return len(result) == 1

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
        print("'1'1'1'1'1'1'1'1'1'1'1'1'")
        print("'1'1'1'1'1'1'1'1'1'1'1'1'")
        print("id_user", id_user, "id_image", id_image)
        print("'1'1'1'1'1'1'1'1'1'1'1'1'")
        print("'1'1'1'1'1'1'1'1'1'1'1'1'")
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
    
    async def delete_saved_from_image(self, user_id: int, image_id: int) -> None:
        await self.__DB.execute('DELETE FROM saved WHERE id_user = $1 AND id_image = $2', user_id, image_id)

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