from datetime import datetime, timezone
import dropbox
from dropbox import files as a
from pydantic import BaseModel
import datetime

class DropBox_client:
    class Add_file_return(BaseModel):
        path: str
        shared_link: str

    def __init__(self) -> None:
        self.__API_KEY    = 'fagt8qrb3adxho7' 
        self.__API_SECRET = 'bty12jbpt74q8wo'
        self.__API = 'sl.B0zMuKVYlmuPBKEcVtP1QGdjA_A_7vZXNDWhE8ApaS4m0X1vO27JCCTq4k--SBCuUkKUNUXCfVQiQk4UrVOgZ-RzlIZNbA2F5DNT-qIr9ZbJPqA2yFzydPEeUueWtaodij8GM4XbMWKGYqg'
        self.drop = dropbox.Dropbox(self.__API)


    async def add_file(self, file, username) -> Add_file_return: 
        data = await file.read()
        file_name = file.filename

        result = self.drop.files_upload(f=data, path="/" + username + "/" + str(datetime.datetime.now(timezone.utc)) + "|" + file_name)
        result = str(result)
        result_path = result.split('path_display=')[1].split('\'')[1]

        result = self.drop.sharing_create_shared_link(result_path, True)
        result = str(result)
        result_link = result.split('url')[1].split('\'')[1][0: -4] + "raw=1"
        
        return DropBox_client.Add_file_return(path=result_path, shared_link=result_link)
        
    async def close(self) -> None: raise NotImplemented 
    async def login(self) -> None: raise NotImplemented


DropBox: DropBox_client = DropBox_client()