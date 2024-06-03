# WARNING: don't use username(login) to provide processes except login, use user.id instead
# to start: granian --interface asgi --reload --host 127.0.0.1 --port 1121 app:app
import time
from asyncpg import exceptions
from fastapi.params import Param
from pydantic_core.core_schema import datetime_schema
from DB import DB, DB_Models, DB_Returns, db

from File_client import DropBox_client, DropBox

from typing import Annotated, Any

from pydantic import BaseModel
from fastapi import Body, FastAPI, Path, HTTPException, Header, status, Depends, Request, UploadFile, File, Form, Query
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # start DB connecion
    await db.setup()
    
    yield # wait for shutdown
    await db.close()

app = FastAPI(lifespan=lifespan)
password_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/login')

origins = ["http://192.168.0.102:5173", "http://192.168.1.101:5173", "http://localhost:5174", "http://localhost:5173", "http://localhost:5175"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["*"],  
)

SECRET_KEY = "476b0f8f5dbe0460361022cfe01b94fe50c74998e15d2206098ca6ff1de1ba8c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

#============================================
# Regex
#============================================

email_regex: str = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
login_regex: str = r"(^[A-Za-z\d._-]{1,20}$)"
tag_regex:   str = r"(^[0-9a-z_]+$)"

#============================================
# Errors handlers
#============================================

@app.exception_handler(exceptions.ForeignKeyViolationError)
async def foreign_key_exception_handler(request: Request, exc: exceptions.ForeignKeyViolationError):
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"message":"Violation of data consistency foreign"})

@app.exception_handler(exceptions.UniqueViolationError)
async def unique_exception_handler(request: Request, exc: exceptions.UniqueViolationError):
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"message":"Violation of data consistency unique"})

#============================================
# Tokens - pass for time
#============================================
class User(BaseModel):
    username: str
    is_admin: bool
    id: int 

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
        detail={"message":"Could not validate credentials"},
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload: dict[str, str] = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        username:     str  | None = payload.get("sub")
        is_admin_str: str  | None = payload.get("is_admin") # actualy returns bool | None
        id_str:       str  | None = payload.get("id") # actualy returns int | None
        time_str:     str  | None = payload.get("exp") # expire data time
        
     
        
        if (is_admin_str is None or username is None or id_str is None or time_str is None): raise credentials_exception
        
        if(int(time_str) < datetime.now(timezone.utc).timestamp()): raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                                                    detail={"message":"Access token is expired", "expired": True})
        
        
        user = User(username=username, is_admin=bool(is_admin_str), id=int(id_str))
        if user.is_admin: 
            if not await db.is_admin(username): raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY,
                                                                    detail={"message":"Access token is incorrect"})
    
    except JWTError: # handles possible errors (maybe somehing like incorrect value for given SECRET_KEY) from jwt.decode, as I understand
        raise credentials_exception
    
    return user


def access_admin(user: Annotated[User, Depends(process_token)]) -> User:
    if user.is_admin: return user
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail={"message":"Access level is too low"})

async def access_user(user: Annotated[User, Depends(process_token)], login: Annotated[str | None, Header(pattern=login_regex)] = None) -> User:
    if login is None:
        return user
    
    if user.is_admin:
        if (login is not None and login != user.username):
            if not await db.login_exists(login): raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                                                     detail={"message":"Specified user login doesn't exist"})
            user.username = login
            user.id = await db.login_to_id(login)
        return user
    
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail={"message":"Don't allowed to use method due to access level or username"})


async def create_access_token(data: dict[str, str | bool | int], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})
    print('aaaaaaaaa')
    print('aaaaaaaaa')
    print(to_encode)
    print('aaaaaaaaa')
    print('aaaaaaaaa')
    return jwt.encode(to_encode, SECRET_KEY, ALGORITHM)



def check_login(hash: str, password: str) -> None: 
    if not password_context.verify(hash=hash, secret=password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail={"message" : "Incorrect username or password"},
                            headers={"WWW-Authenticate": "Bearer"})

# -------------------------------------------

@app.post('/login')
async def get_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    hash_and_admin: DB_Returns.Hash_and_admin | None = (await db.get_hash_and_admin(form_data.username))
    
    if hash_and_admin is None: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                               detail={"message" : "Incorrect username or password"},
                               headers={"WWW-Authenticate": "Bearer"})
    
    check_login(hash_and_admin.hash, form_data.password)

    id = await db.login_to_id(form_data.username)
    if (await db.check_bloked(id) and not hash_and_admin.is_admin): 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail={"message":"Account was banned, due to service laws violation"})

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={
                                           "sub": form_data.username, "is_admin": hash_and_admin.is_admin, 
                                           "id": id
                                       }, 
                                       expires_delta=access_token_expires)
    return Token(access_token=await access_token, token_type="bearer", is_admin=hash_and_admin.is_admin)

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
    return await db.select_all_tags()

@app.post('/tag', tags=['tag'], dependencies=[Depends(access_user)])
async def add_tag(tag_title: Annotated[str, Header(max_length=20, min_length=1, pattern=tag_regex)]):
    await db.add_tag(tag_title)

@app.delete('/tag', tags=['tag'], dependencies=[Depends(access_admin)])
async def delete_tag(tag_id: Annotated[int, Header(ge=1)]):
    await db.delete_tag(tag_id)
#============================================
# Image
#============================================
@app.get('/image/pc', tags=['image'], response_model=list[DB_Returns.Image_PC])
async def get_images_pc(filters: Annotated[list[DB_Models.Image_filters] | None, Query()] = None,
                        tags: Annotated[tuple[int] | None, Query()] = None,
                        last_image_id: int = -1, author_login: str = '#'):
    """
    @param author_login - is for filter published
    """
    
    tags_r = tuple()
    if filters is None:  filters = []
    if tags is not None: tags_r = tags


    return await db.get_images_pc(filters, tags_r, last_image_id, author_login=author_login)

@app.get('/image/pc/user', tags=['image'], response_model=list[DB_Returns.Image_PC])
async def get_images_pc_with_user(user: Annotated[User, Depends(access_user)],
                        filters: Annotated[list[DB_Models.Image_filters] | None, Query()] = None,
                        tags: Annotated[tuple[int] | None, Query()] = None,
                        last_image_id: int = -1, author_login: str = '#'):
    tags_r = tuple()
    if filters is None:  filters = []
    if tags is not None: tags_r = tags

    return await db.get_images_pc(filters, tags_r, last_image_id, user.id, author_login=author_login)


@app.get('/image/mobile', tags=['image'], response_model=list[DB_Returns.Image_mobile])
async def get_images_mobile(filters: list[DB_Models.Image_filters] | None = None,
                            tags: tuple[str] | None = None,
                            last_image_id: int = -1, author_login: str = '#'):

    tags_r = tuple()
    if filters is None:  filters = []
    if tags is not None: tags_r = tags

    return await db.get_images_mobile(filters, tags_r, last_image_id, author_login=author_login)

@app.get('/image/mobile/user', tags=['image'], response_model=list[DB_Returns.Image_mobile])
async def get_images_mobile_with_user(user: Annotated[User, Depends(access_user)],
                            filters: list[DB_Models.Image_filters] | None = None,
                            tags: tuple[str] | None = None,
                            last_image_id: int = -1, author_login: str = '#'):

    tags_r = tuple()
    if filters is None:  filters = []
    if tags is not None: tags_r = tags

    return await db.get_images_mobile(filters, tags_r, last_image_id, user.id, author_login=author_login)


@app.get('/image', tags=['image'], response_model=DB_Returns.Image_full)
async def get_image(image_id: int):
    return await db.get_image(image_id)

@app.get('/image/user', tags=['image'], response_model=DB_Returns.Image_full)
async def get_image_with_user(user: Annotated[User, Depends(access_user)], image_id: int):
    return await db.get_image(image_id, user.id)

# WARNING: Potential danger due to UploadFile usage -> in some case(or maybe cases) it may store file on disk 
@app.post('/image', tags=['image'], response_model=int)
async def add_new_image(*, user: Annotated[User, Depends(access_user)], image: Annotated[UploadFile, File()], 
                        title: Annotated[str, Form(max_length=100, min_length=1)], 
                        description: Annotated[str, Form(max_length=500)] = "",
                        width: Annotated[int, Header(ge=1)], height: Annotated[int, Header(ge=1)],
                        tags: Annotated[list[int] | None, Body()] = None,
                        download_permission: Annotated[bool, Form()] = False): 
    # TODO: add tags check to not just raise an error and forget about all of the tags
    result: DropBox_client.Add_file_return = await DropBox.add_file(image, str(user.id))
    image_id = await db.add_image(user.id, result.shared_link, result.path, title, description, download_permission, width, height)
    if (tags is not None):
        await db.add_tag_to_image(image_id, tags)
    return image_id


@app.delete('/image', tags=['image'])
async def delete_image(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Header(ge=1)]):
    path_and_can_delete: tuple[str, bool] = await db.get_image_path_by_id(image_id, user.id)
    
    if not path_and_can_delete[1]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail={"message":"Can't delete image, not authorized or incorrect image-id"})
    
    await DropBox.delete_file(path_and_can_delete[0])
    await db.delete_image(user.id, image_id)

@app.patch('/image/description', tags=['image', 'admin'])
async def change_picture_description(
        user: Annotated[User, Depends(access_user)], 
        image_id: Annotated[int, Query(ge=1)],
        new_description: Annotated[str, Body(max_length=500)]): 
    await db.update_picture_description(image_id, new_description, user.id)

@app.patch('/image/title', tags=['image', 'admin'])
async def change_picture_title(
        user: Annotated[User, Depends(access_user)], 
        image_id: Annotated[int, Query(ge=1)],
        new_title: Annotated[str, Body(min_length=1, max_length=100)]): 
    await db.update_picture_title(image_id, new_title, user.id)


#============================================
# Like
#============================================
@app.post('/like', tags=['like'])
async def add_like(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Param(ge=1)]):
    await db.add_like(user.id, image_id)

@app.delete('/like', tags=['like'])
async def remove_like(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Param(ge=1)]):
    await db.delete_like(user.id, image_id)

@app.get('/like', tags=['like'], dependencies=[Depends(access_user)], response_model=dict[str, bool | int])
async def current_user_set_like_and_like_counter(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Param(ge=1)]):
    result: tuple[int, bool] = await db.get_like_on_image(user.id, image_id)
    return {"like_counter": result[0], "is_liked": result[1]}

#============================================
# Comment
#============================================
@app.post('/comment', tags=['comment'])
async def add_comment(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Param(ge=1)], description: Annotated[str, Body()]):
    await db.add_comment(user.id, image_id, description)

@app.delete('/comment', tags=['comment'])
async def remove_comment(user: Annotated[User, Depends(access_user)], comment_id: Annotated[int, Param(ge=1)]):
    await db.delete_comment(user.id, comment_id)

@app.get('/comment', tags=['comment'], response_model=list[DB_Returns.Comment])
async def get_last_comment(image_id: Annotated[int, Param(ge=1)], last_commnet_id: int = -1):
    return await db.get_last_comments(image_id, last_commnet_id)

#============================================
# Save
#============================================
@app.post('/save/add', tags=['save'])
async def add_save_image(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Param(ge=1)]) -> None:
    await db.save_image(image_id, user.id)

@app.delete('/save/delete', tags=['save'])
async def delete_save_image(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Param(ge=1)]) -> None:
    await db.delete_saved_from_image(user.id, image_id)


#============================================
# Subscribing
#============================================
@app.post('/subscribe', tags=['subscribe'])
async def subscribe(user: Annotated[User, Depends(access_user)], subscribe_on_id: Annotated[int, Param(ge=1)]):
    if user.id == subscribe_on_id: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"message":"Can't subscribe on yourself"})
    await db.add_subscribe(user.id, subscribe_on_id)

@app.delete('/subscribe', tags=['subscribe'])
async def unsubscribe(user: Annotated[User, Depends(access_user)], subscribed_on_id: Annotated[int, Param(ge=1)]):
    await db.delete_subscribe(user.id, subscribed_on_id)

@app.get('/subscribe/get/on', tags=['subscribe'], response_model=list[DB_Returns.Profile])
async def get_all_profile_on_which_subscribed(login: Annotated[str, Query(pattern=login_regex)], last_profile_id: int = -1):
    return await db.get_subscribed_on_profiles(login, last_profile_id)

@app.get('/subscribe/get/by', tags=['subscribe'], response_model=list[DB_Returns.Profile])
async def get_all_profile_which_are_subscribed(login: Annotated[str, Query(pattern=login_regex)], last_profile_id: int = -1):
    return await db.get_subscribers_on_profiles(login, last_profile_id)

@app.get('/subscribe/check-subscription', tags=['subscribe'], response_model=bool)
async def get_is_subscribed(user: Annotated[User, Depends(access_user)], author_id: Annotated[int, Header(ge=1)]):
    return await db.get_user_subscribed(user.id, author_id)

#============================================
# Profile
#============================================
@app.get('/profile/email/exists', response_model=bool, tags=['profile'])
async def get_email_exists(email: Annotated[str, Param(pattern=email_regex)]):
    return await email_exists(email)

@app.get('/profile/login/exists', response_model=bool, tags=['profile'])
async def get_login_exists(login: Annotated[str, Param(pattern=login_regex)]):
    return await login_exists(login)

@app.get('/profile', response_model=DB_Returns.Profile_full, tags=['profile'])
async def get_profile(login: Annotated[str, Param(pattern=login_regex)]):
    return await db.get_user_profile(login)

@app.get('/profile/user', response_model=DB_Returns.Profile_full, tags=['profile'])
async def get_profile_with_user(
        user: Annotated[User, Depends(access_user)], 
        login: Annotated[str, Param(pattern=login_regex)]):
    
    return await db.get_user_profile(login, user.id)

@app.get('/profile/edit', response_model=DB_Returns.Profile_edit, tags=['profile'])
async def get_profile_info_for_editing(user: Annotated[User, Depends(access_user)]):
    return await db.get_user_profile_edit(user.id)

@app.get('/profile/image', response_model=DB_Returns.Profile_full, tags=['profile'])
async def get_profile_image(login: Annotated[str, Param(pattern=login_regex)]):
    return await db.get_user_profile_picture(login)

@app.post('/admin/add/admin', tags=['admin'], dependencies=[Depends(access_admin)])
async def add_admin(login: Annotated[str, Body(pattern=login_regex, min_length=1, max_length=50)], 
                    password: Annotated[str, Body(min_length=1, max_length=50)], 
                    email: Annotated[str, Body(pattern=email_regex, min_length=1, max_length=100)]):
    hash = hash_password(password)
    await db.add_admin(login, email, hash)


@app.post('/profile/add/user', tags=['profile'], response_model=Token)
async def add_user(login: Annotated[str, Body(pattern=login_regex)], 
                   password: Annotated[str, Body()], 
                   email: Annotated[str, Body(pattern=email_regex)]):
    error_array = []
    if await db.email_exists(email):
        error_array.append("Email is already used")
    if await db.login_exists(login):
        error_array.append("Login is already used")
    if len(error_array) != 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                'errors': error_array,
                'message':'Failed to create user'
            })
      
    hash = hash_password(password)
    await db.add_user(login, email, hash)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={
                                           "sub": login, "is_admin": False, 
                                           "id": await db.login_to_id(login)
                                       }, 
                                       expires_delta=access_token_expires)
    return Token(access_token=await access_token, token_type="bearer", is_admin=False)

@app.delete('/profile/delete', tags=['profile', 'admin'])
async def delete_user(user: Annotated[User, Depends(access_user)]):
    await db.delete_profile(user.id)

@app.delete('/profile/picture/delete', tags=['profile', 'admin'])
async def delete_picture_profile(user: Annotated[User, Depends(access_user)]):
    profile_picture_path: str = await db.get_avatar_path_by_id(user.id)
    if profile_picture_path == "": return 
    
    await DropBox.delete_file(profile_picture_path)
    await db.delete_profile_picture(user.id)


@app.patch('/profile/picture', tags=['profile', 'admin'])
async def change_picture_profile(user: Annotated[User, Depends(access_user)], image: Annotated[UploadFile, File()]): 
    profile_picture_path: str = await db.get_avatar_path_by_id(user.id)
    if profile_picture_path != "": 
        await DropBox.delete_file(profile_picture_path)

    if image.filename == None: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Filename is missing")
    image.filename = "profile_picture_" + image.filename 
    
    result: DropBox_client.Add_file_return = await DropBox.add_file(image, str(user.id))
    await db.update_profile_picture(result.path, result.shared_link, user.id)


@app.patch('/profile/login', tags=['profile', 'admin'])
async def change_login_profile(user: Annotated[User, Depends(access_user)],  new_login: Annotated[str, Header(min_length=1, max_length=50, pattern=login_regex)]):
    await db.update_profile_login(new_login, user.id)    

@app.patch('/profile/description', tags=['profile', 'admin'])
async def change_description_profile(user: Annotated[User, Depends(access_user)], new_description: Annotated[str, Header(min_length=0, max_length=255)] = ""):
    await db.update_profile_description(new_description, user.id)

@app.patch('/profile/email', tags=['profile', 'admin'])
async def change_email_profile(user: Annotated[User, Depends(access_user)], new_email: Annotated[str, Header(min_length=1, max_length=100, pattern=email_regex)]):
    await db.update_profile_email(new_email, user.id)

@app.patch('/profile/password', tags=['profile', 'admin'])
async def change_password_profile(user: Annotated[User, Depends(access_user)], new_password: Annotated[str, Header(min_length=1, max_length=50)]):

    hash = hash_password(new_password)
    await db.update_profile_password(hash, user.id)


#============================================
# Complaint
#============================================
@app.post('/complaint/image', tags=['complaint'])
async def add_complaint_image(user: Annotated[User, Depends(access_user)], image_id: Annotated[int, Param(ge=1)]) -> None:
    await db.add_complaint_image(user.id, image_id)

@app.post('/complaint/comment', tags=['complaint'])
async def add_complaint_comment(user: Annotated[User, Depends(access_user)], comment_id: Annotated[int, Param(ge=1)]) -> None:
    await db.add_complaint_comment(user.id, comment_id)

@app.post('/complaint/profile', tags=['complaint'])
async def add_complaint_profile(user: Annotated[User, Depends(access_user)], profile_owner_id: Annotated[int, Param(ge=1)]) -> None:
    await db.add_complaint_profile(user.id, profile_owner_id)

@app.get('/complaint/comment', tags=['complaint'], dependencies=[Depends(access_admin)], response_model=list[DB_Returns.Comment_reported])
async def get_reported_comments_sorted_by_reports(last_comment_id: Annotated[int, Param()] = -1):
    return await db.get_reported_comments_sorted_by_reports(last_comment_id)

@app.get('/complaint/image', tags=['complaint'], dependencies=[Depends(access_admin)], response_model=list[DB_Returns.Image_reported])
async def get_reported_images_sorted_by_reports(last_image_id: Annotated[int, Param()] = -1):
    return await db.get_reported_images_sorted_by_reports(last_image_id)

@app.get('/complaint/profile', tags=['complaint'], dependencies=[Depends(access_admin)], response_model=list[DB_Returns.Profile_reported])
async def get_reported_profiles_sorted_by_reports(last_profile_id: Annotated[int, Param()] = -1):
    return await db.get_reported_profiles_sorted_by_report_score(last_profile_id)

@app.delete('/complaint/comment', tags=['complaint'], dependencies=[Depends(access_admin)])
async def delete_reports_from_comment(comment_id: Annotated[int, Param(ge=1)]):
    await db.delete_all_reports_from_comment(comment_id)

@app.delete('/complaint/image', tags=['complaint'], dependencies=[Depends(access_admin)])
async def delete_reports_from_image(image_id: Annotated[int, Param(ge=1)]):
    await db.delete_all_reports_from_image(image_id)

@app.delete('/complaint/profile', tags=['complaint'], dependencies=[Depends(access_admin)])
async def delete_all_reports_on_profile(profile_id: Annotated[int, Param(ge=1)]):
    await db.delete_all_reports_from_profile(profile_id)

@app.patch('/complaint/block', tags=['complaint'], dependencies=[Depends(access_admin)])
async def block_user(user_id: Annotated[int, Param(ge=1)]):
    await db.update_block_profile(user_id)

@app.patch('/complaint/unblock', tags=['complaint'], dependencies=[Depends(access_admin)])
async def unblock_user(user_id: Annotated[int, Param(ge=1)]):
    await db.update_unblock_profile(user_id)


#============================================
# Check
#============================================
@app.get('/admin/iam', tags=['admin'], dependencies=[Depends(access_admin)], response_model=str)
def i_am_admin():
    return "You are"

@app.get('/user/iam', tags=['admin'], response_model=str)
def i_am_user(user: Annotated[User, Depends(access_user)], image: Annotated[UploadFile, File()]):
    return "You are " + user.username


# @app.middleware("http")
# async def log_request_body(request: Request, call_next):
#     # Access the request body
#     body_bytes = await request.body()
#     body_str = body_bytes.decode("utf-8")
#     print('----------------------')
#     print('----------------------')
#     print(f"Request body: {body_str}")
#     print(f"Request header: {request.headers}")
#     print(f"URL: f{request.url}") 
#     print('----------------------')
#     print('----------------------')
    
#     response = await call_next(request)
#     return response

@app.get("/items/")
async def read_items(q: Annotated[list[str] | None, Query()] = None):
    query_items = {"q": q}
    return query_items