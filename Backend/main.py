from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import FastAPI
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
    allow_origins=["http://127.0.0.1:5501", "http://localhost:5501", "http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up static file serving
# Assuming the frontend files are in a parent directory relative to Backend
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "")
app.mount("/css", StaticFiles(directory=os.path.join(frontend_dir, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(frontend_dir, "js")), name="js")
app.mount("/img", StaticFiles(directory=os.path.join(frontend_dir, "img")), name="img")

# Root path to serve index.html
@app.get("/")
def read_root():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

# Serve credit-score.html
@app.get("/credit-score")
def credit_score_page():
    return FileResponse(os.path.join(frontend_dir, "credit-score.html"))

# Serve applications.html
@app.get("/applications")
def applications_page():
    return FileResponse(os.path.join(frontend_dir, "applications.html"))

# Serve credit-score.html (with .html extension)
@app.get("/credit-score.html")
def credit_score_page_html():
    return FileResponse(os.path.join(frontend_dir, "credit-score.html"))

# Serve applications.html (with .html extension)
@app.get("/applications.html")
def applications_page_html():
    return FileResponse(os.path.join(frontend_dir, "applications.html"))

# Serve other HTML pages with .html extension
@app.get("/{page_name}.html")
def serve_html_page(page_name: str):
    file_path = os.path.join(frontend_dir, f"{page_name}.html")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return JSONResponse(status_code=404, content={"message": "Page not found"})

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
    try:
        print("Received farmer data:", data.dict())
        
        # Create a dictionary from all submitted form data
        farmer_data = data.dict()
        
        # Calculate the credit score using all form fields
        new_credit_score, factor_percentages = calculate_new_credit_score(farmer_data)
        
        # Generate loan recommendation
        recommendation = recommend_loan(new_credit_score, data.crop_type)
        
        print(f"Calculated credit score: {new_credit_score}")
        print(f"Factor percentages: {factor_percentages}")
        print(f"Recommendation: {recommendation}")
        
        return JSONResponse(status_code=200,
            content={
                "new_credit_score": new_credit_score, 
                "recommendation": recommendation,
                "factors": factor_percentages
            })
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR in credit score calculation: {str(e)}")
        print(error_details)
        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "message": "An error occurred while calculating credit score"
            }
        )