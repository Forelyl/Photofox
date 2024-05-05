from sre_constants import ANY
import psycopg2 as postgres
from typing import Any


class DB:
    __PORT = "5342"
    __IP = "127.0.0.1"

    def __init__(self, dbname: str, user: str, password: str) -> None:
        self.dbname = dbname
        self.user = user
        self.password = password
        self.connection = postgres.connect(dbname=dbname, user=user, password=password, port=DB.__PORT, host=DB.__IP)
        self.database = self.connection.cursor()

        
    def __del__(self) -> None:
        self.database.close()
        self.connection.close()

    def execute(self, query: str, variables: tuple | None = None):
        self.database.execute(query, variables)

    def get_values_from_select(self) -> list[tuple[Any, ...]]:
        return self.database.fetchall() 

class PhotoFox:
    __DBNAME   = "photofox";
    __USER     = "fox";
    __PASSWORD = "qweasd12";

    def __init__(self) -> None:
        self.__DB =  DB(PhotoFox.__DBNAME, PhotoFox.__USER, PhotoFox.__PASSWORD)
    
    
    
    # SELECT
    def select_all_tags(self) -> list[tuple[str, int]]: # list[tuple[title, id]]
        self.__DB.execute("SELECT * FROM tag")
        result: list[tuple[Any, ...]] = self.__DB.get_values_from_select()
        function_result: list[tuple[str, int]] = list((x[1], x[0]) for x in result)
        return function_result

    #INSERT

    #DELETE

    #UPDATE


db = PhotoFox()