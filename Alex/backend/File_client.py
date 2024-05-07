from datetime import datetime, timezone
import dropbox
from dropbox import files as a
from fastapi import FastAPI, Request, UploadFile, File
import datetime

class DropBox_client:
    def __init__(self) -> None:
        self.__API_KEY    = 'fagt8qrb3adxho7' 
        self.__API_SECRET = 'bty12jbpt74q8wo'
        self.__API = 'sl.B0zMuKVYlmuPBKEcVtP1QGdjA_A_7vZXNDWhE8ApaS4m0X1vO27JCCTq4k--SBCuUkKUNUXCfVQiQk4UrVOgZ-RzlIZNbA2F5DNT-qIr9ZbJPqA2yFzydPEeUueWtaodij8GM4XbMWKGYqg'
        self.drop = dropbox.Dropbox(self.__API)


    async def setup(self, file, username): 
        data = await file.read()
        file_name = file.filename

        result = self.drop.files_upload(f=data, path="/" + username + "/" + str(datetime.datetime.now(timezone.utc)) + "|" + file_name)
        result = str(result)
        result_path = result.split('path_display=')[1].split('\'')[1]
        

        result = self.drop.sharing_create_shared_link(result_path, True)
        result = str(result)
        result_link = result.split('url')[1].split('\'')[1][0: -4] + "raw=1"
        
        print(result_link)
        
    async def close(self) -> None: raise NotImplemented 
    async def login(self) -> None: raise NotImplemented

# curl https://api.dropbox.com/oauth2/token -d grant_type=refresh_token -d client_id=fagt8qrb3adxho7 -d client_secret=bty12jbpt74q8wo

# curl https://api.dropbox.com/oauth2/token -d grant_type=authorization_code -d client_id=fagt8qrb3adxho7 -d client_secret=bty12jbpt74q8wo -d client_secret=<APP_SECRET>

# sl.B0w7CeZTYXgWiwRMU8PID8q-RtTxx7F-I4BXr3-qbJ3MnI0d75dNG7WLceayG_JTJ3rw4dxNtG8WrsQr8Vf3AVS-Rnmz7ERlAgikkBghe5yRzsqWv8OFDW0fL5Qn0_Y0ir0SlR2u81GWmv4


#curl -X POST https://content.dropboxapi.com/2/files/upload --header "Authorization: Bearer sl.B0w7CeZTYXgWiwRMU8PID8q-RtTxx7F-I4BXr3-qbJ3MnI0d75dNG7WLceayG_JTJ3rw4dxNtG8WrsQr8Vf3AVS-Rnmz7ERlAgikkBghe5yRzsqWv8OFDW0fL5Qn0_Y0ir0SlR2u81GWmv4" --header "Dropbox-API-Arg: {\"autorename\":false,\"mode\":\"overwrite\",\"mute\":false,\"path\":\"/PhotoFox_DB/2.jpg\",\"strict_conflict\":false}" --header "Content-Type: application/octet-stream"  --data-binary @local_file.txt

