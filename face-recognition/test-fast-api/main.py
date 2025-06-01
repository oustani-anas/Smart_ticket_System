
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserCredentials(BaseModel):
    username: str
    password: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.post("/login")
async def login(credentials: UserCredentials):
    print(f"username : {credentials.username}")
    print(f"username : {credentials.password}")
    return {"username": credentials.username, "password": credentials.password}