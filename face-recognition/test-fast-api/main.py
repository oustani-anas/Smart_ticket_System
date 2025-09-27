
from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
import numpy as np
import cv2
import io

import os
import sys

# Ensure parent directory is importable when running as a script
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

import database
from face_utils import FaceProcessor

app = FastAPI()

face_processor = FaceProcessor()


class RegisterResponse(BaseModel):
    user_id: str
    user_name: str
    status: str


class RecognizeResponse(BaseModel):
    status: str
    user_name: Optional[str] = None
    similarity: Optional[float] = None


@app.get("/")
def read_root():
    return {"service": "face-recognition-api", "status": "ok"}


@app.on_event("startup")
def startup_event():
    database.initialize_database()


@app.post("/register", response_model=RegisterResponse)
async def register(user_name: str = Form(...), image: UploadFile = File(...)):
    try:
        contents = await image.read()
        if not contents:
            return {"user_id": "", "user_name": user_name, "status": "invalid_image"}
            
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"user_id": "", "user_name": user_name, "status": "invalid_image"}

        embedding = face_processor.get_face_embedding(img)
        if embedding is None:
            return {"user_id": "", "user_name": user_name, "status": "no_face_detected"}

        if not isinstance(embedding, list):
            embedding = embedding.tolist()

        if database.user_name_exists(user_name):
            return {"user_id": "", "user_name": user_name, "status": "user_exists"}

        import uuid
        user_id = str(uuid.uuid4())
        database.add_face_record(user_id, user_name, embedding)
        return {"user_id": user_id, "user_name": user_name, "status": "registered"}
    except Exception as e:
        print(f"Error in register: {e}")
        return {"user_id": "", "user_name": user_name, "status": "error"}


@app.post("/recognize", response_model=RecognizeResponse)
async def recognize(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        if not contents:
            return {"status": "invalid_image"}
            
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"status": "invalid_image"}

        embedding = face_processor.get_face_embedding(img)
        if embedding is None:
            return {"status": "no_face_detected"}

        # find best match
        face_records = database.get_face_records()
        if not face_records:
            return {"status": "no_users"}

        best_name = None
        best_sim = -1.0
        for _, name, saved_embedding in face_records:
            sim = face_processor.calculate_similarity(embedding, saved_embedding)
            if sim > best_sim:
                best_sim = sim
                best_name = name

        # threshold can be tuned
        if best_sim >= 0.75:
            return {"status": "matched", "user_name": best_name, "similarity": float(best_sim)}

        return {"status": "user_not_found"}
    except Exception as e:
        print(f"Error in recognize: {e}")
        return {"status": "error"}