# to start: granian --interface asgi --reload --host 127.0.0.1 --port 1121 app:app
from DB import PhotoFox, db

from dataclasses import dataclass
from logging import disable
from os import error
from typing import Annotated, NamedTuple
from enum import Enum
from uuid import UUID

from pydantic import BaseModel
from fastapi import Body, FastAPI, Form, HTTPException, Header, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

import asyncio

app = FastAPI()
password_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/token')


SECRET_KEY = "2f90baaaebded8f02142790370587071657134e2b118d618cdfd758dc04671fb"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


#============================================
# Tokens - pass for time
#============================================

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
    await db.setup()
    return await db.select_all_tags()

#============================================
# Image
#============================================

#============================================
# Profile
#============================================

#============================================
# Complaint
#============================================
