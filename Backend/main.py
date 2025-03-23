from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from typing import List, Optional
from pydantic import BaseModel, Field

from credit_score_with_rec import calculate_new_credit_score, recommend_loan

# Load environment variables from .env file
load_dotenv()

# Access variables
api_key = os.getenv("API_KEY")

DATABASE_URL = f"postgresql://postgres:{api_key}@gondola.proxy.rlwy.net:16607/railway"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserCreate(BaseModel):
    name: str
    email_id: str
    role: str
    password: str

class FarmerMetadata(BaseModel):
    # Base credit score field
    current_score: int = Field(500, description="Base credit score")
    
    # Basic farmer info
    farmerName: Optional[str] = None
    farmSize: Optional[float] = None
    farmAge: Optional[int] = None
    ownershipStatus: Optional[str] = None
    
    # Location and climate info
    district: str  # This is the location field
    soilType: Optional[str] = None
    waterSource: Optional[str] = None
    climateIssues: Optional[List[str]] = None
    
    # Crop info
    crop_type: str  # Primary crop
    lastYieldAmount: Optional[float] = None
    techniques: Optional[List[str]] = None
    equipmentOwned: Optional[str] = None
    
    # Time-related
    month: int
    
    class Config:
        schema_extra = {
            "example": {
                "current_score": 500,
                "farmerName": "Ramesh Kumar",
                "farmSize": 15,
                "farmAge": 8,
                "ownershipStatus": "owned",
                "district": "Ahmedabad",
                "soilType": "loam",
                "waterSource": "well",
                "climateIssues": ["drought", "heatwave"],
                "crop_type": "Wheat",
                "lastYieldAmount": 2.5,
                "techniques": ["noTill", "precision"],
                "equipmentOwned": "partial",
                "month": 5
            }
        }

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

@app.post("/api/userCreate", response_model=None)
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

@app.post("/api/creditScore", response_model=None)
def credit_score(data: FarmerMetadata):
    print("Received farmer data:", data.dict())
    
    # Create a dictionary from all submitted form data
    farmer_data = data.dict()
    
    # Calculate the credit score using all form fields
    new_credit_score = calculate_new_credit_score(farmer_data)
    
    # Generate loan recommendation
    recommendation = recommend_loan(new_credit_score, data.crop_type)
    
    print(f"Calculated credit score: {new_credit_score}")
    print(f"Recommendation: {recommendation}")
    
    return JSONResponse(status_code=200,
        content={"new_credit_score": new_credit_score, "recommendation": recommendation})