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
        self.__API = 'sl.B2AY6G2_DIBwlCwhD-NxPe01uqrVr7jKh2MKHT_MDasK6ZRYPg9gGvCmT70NT1S9yQOf7D3Z5KsltUxKDg-idHLDNqN3X3InKb3Vt8SkEiXDYJ8h1VTRKChcFoSoXeS0trSABVwJwY4gw34'
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