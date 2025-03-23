from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from credit_score_with_rec import calculate_new_credit_score, recommend_loan

# Load environment variables from .env file
load_dotenv()

# Access variables
api_key = os.getenv("API_KEY")

DATABASE_URL = f"postgresql://postgres:{api_key}@gondola.proxy.rlwy.net:16607/railway"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email_id: str
    role: str
    password: str

class farmerMetadata(BaseModel):
    current_score: int
    district: str
    crop_type: str
    month: int



class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email_id = Column(String)
    password_hash = Column(String)
    role = Column(String)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/userCreate",response_model=None)
def save_farmer(data: UserCreate):
    db = SessionLocal()
    new_farmer = User(
        name=data.name,
        email_id=data.email_id,
        role=data.role,
        password_hash=data.password
    )
    db.add(new_farmer)
    db.commit()
    return JSONResponse(status_code=200,
        content={"message": "User created successfully."})
    

@app.post("/api/creditScore",response_model=None)
def credit_score(data: farmerMetadata):
    print("data is: ", data)
    new_credit_score = calculate_new_credit_score(data.current_score, data.district, data.crop_type, data.month)
    recommendation = recommend_loan(new_credit_score, data.crop_type)
    print(new_credit_score, recommendation)
    return JSONResponse(status_code=200,
        content={"new_credit_score": new_credit_score, "recommendation": recommendation})