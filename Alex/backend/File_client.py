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
        self.__API = 'sl.B0wubx6EOuEnt78_YDl0EDPjigExj6FxXzQJOiuNmLKDF62WyKI-lxS2ZzDVffS9FfIjI4S3qVsAepIl12p1S3GJSCdt_OW2Z_IrE90d0MIOg0y0YHBmD1CBL621HaF8IB7pzsSs7tLqWT8'
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
    

    async def delete_file(self, file_path: str) -> None:
        self.drop.files_delete(file_path)

DropBox: DropBox_client = DropBox_client()