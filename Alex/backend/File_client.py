import dropbox
from fastapi import FastAPI, Request, UploadFile, File


class DropBox_client:
    def __init__(self) -> None:
        self.__API_KEY    = 'fagt8qrb3adxho7' 
        self.__API_SECRET = 'bty12jbpt74q8wo'
        self.__API = 'uat.AE98yrMZf_uwlLMgrT3ZLTYb8SaktYcovnArj18yNIhJgX1btKO8xLfbzrT2R2IzDhmGvwdaMQwveQX2dnHXBEYDASpl27R3O1hk3k0pLeA5rhGwSjIwHbBRodX1arGBH8GBS2w30ztpFdVw7tbVwP20_9S5TyzNiy29XLCcKZWUxQwJO0UwqgDTHGtMaTgkKnDmhkUM_4poJ2qWS_63_JbszMN7fECsOdBtj9zFa7xCKKybkHRYCEJw0KFj2n9KFUC3WGrLLZJw46SbnfWQFT7zvd6jZkUP3dUO3eHmce3gcededlv6DqAv2brCv9GlsnRKJJ9XnzriNFXnQbQbuV8ov1k2OXnbjKKi2hXRmla081SThB3jEES5Eb_jTqbndQVgUaJqP2wJ-41Um7VJc7JJh1hbmGuEiLNLnwE-_J5CtFi2aFUr08QyOY1Owp4h5-_wehKDW232GRiKChKCpIF2BnO-yeY7PP2CD1-9Lze7eUZPYbROZ-GjNUP1dRRrHYcszoofTkenxIUTALFNTaS6ZAsvPDDhfwjSZbLigbwiuEtKd4JNFovt9nQxDdLdUA1YNbu2ay9Fgneb7SoNgUI4kfVsjN0a-TwLBF2vXaHEnbM2X0ej7GIyVx1fqgp6nqM4FDimlncOg_feWYCJk74ZhjZfuollaYa-jeJlSH4Gd_zZhzmAYj-17aNTnSz7UkdsmP6HOKxo6wRl3aT7bMiQMvtY2FeVd-LCStIO7FmGb5DATwHYO7QWrcmJ2We6NAA-NzKgBDe6ynu70b4-iDup0UCTmHdEhsndkVpCk6_P9P4VbWKzFpkEvupIx1AKzPScdnCEIIqJy3Hvt3KHA_C7VnpK21Kv3IPZkrXh_W4_784ewU0YXF6tqweiX3Pa0HPwqgess27C7m8PMzqWzim-InX-mzIPRcRjHge8N5OPf_oWdIifwEy7nodBAfw773ZUwA-QsY6Nl2UA4caRDmn-fFqb3RzHpRzJecgxNzuvOLPwucKMpqX_Wm2WA63hNQKwTMgwZGinm1bDiLK_JZYAQ_nQpmr6JKRU29vPQXT4RiqFwflK3lyzUQCyOzd64BKf9MhN1myOgx8x6waupQuwcGz_eqM6VdujqNhA8_JEXNZfqXoUN9e5s9DNRvDw-KNud8EHc_yTrrKktcnH1fKvoebtn81kHjqA-GaXeLh3phA8ag__yxhRVPRsJFTX0SdHw9ro9kYYpxsw_-5n32oT7SUT93PiiohHLyYjnqqRtb2Ie-ksW4SSgnlhLtytmFSdFHyNdlFSTRK9JfaWmC9okKFmkQ_tmbj2UndkZhTo60SYvqnZkfjTBj998hojeSawOiVFREQ2cMq7TiwJgo0vFp0gMJPXaKRbErSNtBnHFzGt_YDG3yAExs0CCTKyIdJ0Wpw67EE-UhrNWxYHANZg18RwdF5o8cBpgeblA_yfKUso-wTPG92dAPHuv6Rqqw5Cg5BcjuFJL-SbgoOXnW-VnpmeQqxD6FvHAym9tuJpqS3l8RuhIvCmCt9bkNpXrnU'
        self.drop = dropbox.Dropbox(self.__API)


    async def setup(self, file): 
        data = await file.read()
        self.drop.files_upload(f=data, path='/Apps/Photofox_DB/2.jpg')
        self.drop.sharing_create_shared_link

        
    async def close(self) -> None: raise NotImplemented 
    async def login(self) -> None: raise NotImplemented

# curl https://api.dropbox.com/oauth2/token -d grant_type=refresh_token -d client_id=fagt8qrb3adxho7 -d client_secret=bty12jbpt74q8wo

# curl https://api.dropbox.com/oauth2/token -d grant_type=authorization_code -d client_id=fagt8qrb3adxho7 -d client_secret=bty12jbpt74q8wo -d client_secret=<APP_SECRET>

# sl.B0w7CeZTYXgWiwRMU8PID8q-RtTxx7F-I4BXr3-qbJ3MnI0d75dNG7WLceayG_JTJ3rw4dxNtG8WrsQr8Vf3AVS-Rnmz7ERlAgikkBghe5yRzsqWv8OFDW0fL5Qn0_Y0ir0SlR2u81GWmv4


#curl -X POST https://content.dropboxapi.com/2/files/upload --header "Authorization: Bearer sl.B0w7CeZTYXgWiwRMU8PID8q-RtTxx7F-I4BXr3-qbJ3MnI0d75dNG7WLceayG_JTJ3rw4dxNtG8WrsQr8Vf3AVS-Rnmz7ERlAgikkBghe5yRzsqWv8OFDW0fL5Qn0_Y0ir0SlR2u81GWmv4" --header "Dropbox-API-Arg: {\"autorename\":false,\"mode\":\"overwrite\",\"mute\":false,\"path\":\"/PhotoFox_DB/2.jpg\",\"strict_conflict\":false}" --header "Content-Type: application/octet-stream"  --data-binary @local_file.txt

