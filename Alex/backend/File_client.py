import httpx as http
from fastapi import FastAPI, Request, UploadFile, File


class DropBox_client:
    def __init__(self) -> None:
        self.__API_KEY    = 'fagt8qrb3adxho7' 
        self.__API_SECRET = 'bty12jbpt74q8wo'
        self.__API = 'sl.B0w-3f3Uz93MVfIc10kBdRGtx09t16LT0O_bcLNwPgybavSWxLFCsfWNJW7Y_hRxmrNnV8Y0PUVmxB7cTGHha90HkwJ86i9B7nKvS6pFwZJ4yFZJ8_6DVH70YAaCIQRwvuivxA7j5c-Gheg'
        self.auth = http.BasicAuth(username="username", password="secret")
        self.client = http.AsyncClient(http2=True, auth=self.auth)


    def setup(self): 
        
        url: http.URL = http.URL('https://content.dropboxapi.com/2/files/upload')
        headers: http.Headers = http.Headers({
            'Authorization': 'Bearer sl.B0yYlZxXGnmeWrZHZFfbuzpj84z9Wi5mL3UetH-jZhyCnpdowUUg-6-8B04Y8a1dePFzn8a8MBguL8Fat2yHcdZIftgmXDSqy5LJGRtwWTY9u4K-ir0rqdUscH_2xh30d99V486p5CQeTi8',
            'Dropbox-API-Arg': '{"autorename": false, "mode": "overwrite", "mute":false, "path":"/Apps/PhotoFox_DB/2.jpg", "strict_conflict": true}',
            'Content-Type': 'application/octet-stream'
        })

        return lambda file: self.client.request(
            method='POST', 
            url=url,
            headers=headers,
            files={'file': (file.filename, file.file)}
        )

        
    async def close(self) -> None: raise NotImplemented 
    async def login(self) -> None: raise NotImplemented

# curl https://api.dropbox.com/oauth2/token -d grant_type=refresh_token -d client_id=fagt8qrb3adxho7 -d client_secret=bty12jbpt74q8wo

# curl https://api.dropbox.com/oauth2/token -d grant_type=authorization_code -d client_id=fagt8qrb3adxho7 -d client_secret=bty12jbpt74q8wo -d client_secret=<APP_SECRET>

# sl.B0w7CeZTYXgWiwRMU8PID8q-RtTxx7F-I4BXr3-qbJ3MnI0d75dNG7WLceayG_JTJ3rw4dxNtG8WrsQr8Vf3AVS-Rnmz7ERlAgikkBghe5yRzsqWv8OFDW0fL5Qn0_Y0ir0SlR2u81GWmv4


#curl -X POST https://content.dropboxapi.com/2/files/upload --header "Authorization: Bearer sl.B0w7CeZTYXgWiwRMU8PID8q-RtTxx7F-I4BXr3-qbJ3MnI0d75dNG7WLceayG_JTJ3rw4dxNtG8WrsQr8Vf3AVS-Rnmz7ERlAgikkBghe5yRzsqWv8OFDW0fL5Qn0_Y0ir0SlR2u81GWmv4" --header "Dropbox-API-Arg: {\"autorename\":false,\"mode\":\"overwrite\",\"mute\":false,\"path\":\"/PhotoFox_DB/2.jpg\",\"strict_conflict\":false}" --header "Content-Type: application/octet-stream"  --data-binary @local_file.txt

