# to start: granian --interface asgi --reload --host 127.0.0.1 --port 1121 app:app
from asyncpg import Path
from fastapi.params import Param
from DB import DB_Returns, db

from File_client import DropBox_client as Dropbox

from typing import Annotated

from pydantic import BaseModel
from fastapi import Body, FastAPI, Form, HTTPException, Header, status, Depends, Request, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # start DB connecion
    await db.setup()
    await db.get_id_of_next_image()
    
    yield # wait for shutdown
    await db.close()

app = FastAPI(lifespan=lifespan)
password_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token')


SECRET_KEY = "476b0f8f5dbe0460361022cfe01b94fe50c74998e15d2206098ca6ff1de1ba8c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

#============================================
# Regex
#============================================

email_regex: str = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
login_regex: str = r"(^[A-Za-z\d._-]{1,20}$)"

#============================================
# Tokens - pass for time
#============================================
class User:
    def __init__(self, username: str = "", is_admin: bool = False):
        self.username = username
        self.is_admin = is_admin

class Token(BaseModel): 
    token_type: str
    access_token: str # "sub": who, "is_admin": True | False, "exp": until
    is_admin: bool


# -------------------------------------------
def hash_password(password):
    return password_context.hash(password)

async def email_exists(email: str):
    return await db.email_exists(email)

async def login_exists(login: str):
    return await db.login_exists(login)

# -------------------------------------------

async def process_token(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload: dict[str, str] = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        username:     str | None = payload.get("sub")
        is_admin_str: str | None = payload.get("is_admin")

        if (is_admin_str is None or username is None): raise credentials_exception
        
        user = User(username, is_admin_str == True)
        if user.is_admin: 
            if not await db.is_admin(username): raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY,
                                                                    detail="Access token is incorrect")
    
    except JWTError: # handles possible errors (maybe somehing like incorrect value for given SECRET_KEY) from jwt.decode, as I understand
        raise credentials_exception
    
    return user


def access_admin(user: Annotated[User, Depends(process_token)]) -> User:
    if user.is_admin: return user
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Access level is too low")

async def access_user(user: Annotated[User, Depends(process_token)], login: Annotated[str | None, Header(pattern=login_regex)] = None) -> User:
    if login is None:
        return user
    
    if user.is_admin:
        if (login is not None):
            if not await db.login_exists(login): raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Specified user login doesn't exist")  
            user.username = login
        return user
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Don't allowed to use method due to access level or username")  
    

def create_access_token(data: dict[str, str | bool], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": str(expire)})

    return jwt.encode(data, SECRET_KEY, ALGORITHM)



def check_login(hash: str, password: str) -> None: 
    if not password_context.verify(hash=hash, secret=password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})

# -------------------------------------------

@app.post('/token')
async def get_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    hash_and_admin: DB_Returns.Hash_and_admin | None = (await db.get_hash_and_admin(form_data.username))
    
    if hash_and_admin is None: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                               detail="Incorrect username or password",
                               headers={"WWW-Authenticate": "Bearer"})
    
    check_login(hash_and_admin.hash, form_data.password)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": form_data.username, "is_admin": hash_and_admin.is_admin}, expires_delta=access_token_expires)
    return Token(access_token=access_token, token_type="bearer", is_admin=hash_and_admin.is_admin)

#============================================
# Models
#============================================

class Tag(BaseModel):
    title: str
    id: int   

#============================================
# Tag
#============================================
@app.get('/tag/all', response_model=list[Tag], tags=['tag'])
async def get_all_tags():
    await email_exists("cat@gmail.com")
    await email_exists("2")
    return await db.select_all_tags()

#============================================
# Image
#============================================
@app.get('/image/last', tags=['image'], response_model=list[DB_Returns.Image])
async def get_last_images_pc(last_image_id: int = -1):
    return await db.get_images_pc(last_image_id)

@app.get('/image/last/mobile', tags=['image'], response_model=list[DB_Returns.Image_mobile])
async def get_last_images_mobile(last_image_id: int = -1):
    return await db.get_images_mobile(last_image_id)

@app.get('/image/', tags=['image'], response_model=DB_Returns.Image_full)
async def get_images(image_id: int):
    return await db.get_image(image_id)

@app.get('/image/subscribed', tags=['image'], response_model=list[DB_Returns.Image])
async def get_subscribed_images_pc(user: Annotated[User, Depends(access_user)], last_image_id: int = -1):
    return await db.get_subscribed_images_pc(user.username, last_image_id)

@app.get('/image/subscribed/mobile', tags=['image'], response_model=list[DB_Returns.Image_mobile])
async def get_subscribed_images_mobile(user: Annotated[User, Depends(access_user)], last_image_id: int = -1):
    return await db.get_subscribed_images_mobile(user.username, last_image_id)

@app.post('/image', tags=['image'], response_model=bool)
async def add_new_image(user: Annotated[User, Depends(access_user)], image: UploadFile = File(...)): 
    d = Dropbox()

    print(type(image))
    await d.setup(image)

    return True


#============================================
# Profile
#============================================
@app.get('/profile/email/exists', response_model=bool, tags=['profile'])
async def get_email_exists(email: Annotated[str, Param(pattern=email_regex)]):
    return await email_exists(email)

@app.get('/profile/login/exists', response_model=bool, tags=['profile'])
async def get_login_exists(login: Annotated[str, Param(pattern=login_regex)]):
    return await login_exists(login)

@app.post('/admin/add/admin', tags=['admin'], dependencies=[Depends(access_admin)])
async def add_admin(login: Annotated[str, Body(pattern=login_regex)], 
                    password: Annotated[str, Body()], 
                    email: Annotated[str, Body(pattern=email_regex)]):
    hash = hash_password(password)
    await db.add_admin(login, email, hash)


@app.post('/admin/add/user', tags=['admin'])
async def add_user(login: Annotated[str, Body(pattern=login_regex)], 
                   password: Annotated[str, Body()], 
                   email: Annotated[str, Body(pattern=email_regex)]):
    if await db.email_exists(email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already used")
    if await db.login_exists(login):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login is already used")
      
    hash = hash_password(password)
    await db.add_user(login, email, hash)

#============================================
# Complaint
#============================================


#============================================
# Check
#============================================
@app.get('/admin/iam', tags=['admin'], dependencies=[Depends(access_admin)], response_model=str)
def i_am_admin():
    return "You are"

@app.get('/user/iam', tags=['admin'], response_model=str)
def i_am_user(user: Annotated[User, Depends(access_user)]):
    return "You are " + user.username