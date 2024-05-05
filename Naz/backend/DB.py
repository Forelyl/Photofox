import psycopg as postgres
from psycopg.rows import dict_row
from psycopg import sql
from typing import Any


class DB:
    __PORT = "5342"
    __IP = "127.0.0.1"

    async def __init__(self, dbname: str, user: str, password: str) -> None:
        self.dbname = dbname
        self.user = user
        self.password = password
        self.connection = await postgres.AsyncConnection.connect(dbname=dbname, user=user, password=password, port=DB.__PORT, host=DB.__IP, row_factory=dict_row)
        self.database = self.connection.cursor()

        
    async def __del__(self) -> None:
        await self.database.close()
        await self.connection.close()

    async def execute(self, query: str, variables: tuple | None = None):
        await self.database.execute(sql.SQL("%s").format(query), variables)

    async def get_values_from_select(self) -> list[dict]:
        return await self.database.fetchall() 

class PhotoFox:
    __DBNAME   = "photofox";
    __USER     = "fox";
    __PASSWORD = "qweasd12";

    def __init__(self) -> None:
        self.__DB =  DB(PhotoFox.__DBNAME, PhotoFox.__USER, PhotoFox.__PASSWORD)
    
    
    
    # SELECT
    async def select_all_tags(self) -> list[dict]: # list[tuple[title, id]]
        await self.__DB.execute("SELECT * FROM tag")
        return await self.__DB.get_values_from_select()
        
    #INSERT

    #DELETE

    #UPDATE


db = PhotoFox()