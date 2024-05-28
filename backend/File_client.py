from datetime import datetime, timezone
from re import A
import dropbox
from dropbox import oauth
from pydantic import BaseModel
import datetime

# TODO: add restriction on image type
class DropBox_client:
    class Add_file_return(BaseModel):
        path: str
        shared_link: str

    def __init__(self) -> None:
        self.__API_KEY    = 'fagt8qrb3adxho7' 
        self.__API_SECRET = 'bty12jbpt74q8wo'
        self.__API = 'sl.B2AY6G2_DIBwlCwhD-NxPe01uqrVr7jKh2MKHT_MDasK6ZRYPg9gGvCmT70NT1S9yQOf7D3Z5KsltUxKDg-idHLDNqN3X3InKb3Vt8SkEiXDYJ8h1VTRKChcFoSoXeS0trSABVwJwY4gw34'
        self.__API_REFRESH_TOKEN = 'ygwX9ssOZK4AAAAAAAAAAa54lBJIluDqaM7zdONzR-roS6p4JAlIpTIDTc5Q2LZ8'
        # self.aoaoa()
        # self.drop = dropbox.Dropbox(self.__API)
        self.drop = dropbox.Dropbox(app_key=self.__API_KEY, app_secret=self.__API_SECRET, oauth2_refresh_token=self.__API_REFRESH_TOKEN)
        print(self.drop.refresh_access_token())

    def aoaoa (self): 
        drtr = oauth.DropboxOAuth2FlowNoRedirect(
            consumer_key=self.__API_KEY, 
            consumer_secret=self.__API_SECRET, 
            locale='en', 
            token_access_type='offline', 
            scope=["files.metadata.write", "files.metadata.read", "files.content.write", "files.content.read",
                   "sharing.write", "sharing.read", "file_requests.write", "file_requests.read"],
            include_granted_scopes="user",
            use_pkce=False)
        print(drtr.start())
        a = input("Mate do the thing des: ")
        print("Token is: " + drtr.finish(a).refresh_token)

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