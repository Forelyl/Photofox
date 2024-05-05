import asyncpg as postgres
from typing import Any
import asyncio
import sys



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
            async for x in self.database.cursor(query):
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

class PhotoFox:

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
    # -4) email is exists
    # -3) login is exists
    # -2) is_admin for login
    # -1) hash, is_admin - user 
    # 0)  select image with limit
    # 1)  select image info without counter of reports
    # 2)  select comment with limit without counter of reports - I think that it could be tricky cause we don't neeed just offset we need to also specidfy what object was first when we get data for first time (or for last for 3-rd and so on)
    # 3)  select tag like str
    # 4)  
    # 5)  select image with size | None, tag | None, data | None, size_ratio | None, like | None
    # 6)  select image with author
    # 7)  select image with complaints
    # 8)  select profile with complaints
    # 9)  select image with complaints
    # X)     


    async def select_all_tags(self): # list[tuple[title, id]]
        return DB.process_return(await self.__DB.execute("SELECT * FROM tag"))
    
    #INSERT

    #DELETE

    #UPDATE

async def print_XD(db: PhotoFox):
    value = await db.select_all_tags()
    print(value)


db = PhotoFox()

# asyncio.run(print_XD(db))
# asyncio.run(db.close())