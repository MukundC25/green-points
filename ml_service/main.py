#!/usr/bin/env python3
"""
FastAPI service for E-Waste ML model predictions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import joblib
import os
import logging
from train_model import EWastePricingModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Green Points ML Service",
    description="AI-powered e-waste pricing and green points prediction",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],  # Node.js and React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
ml_model = None

class PredictionRequest(BaseModel):
    """Request model for price/points prediction"""
    product_type: str = Field(..., description="Type of electronic product")
    brand: str = Field(..., description="Brand of the product")
    condition: str = Field(..., description="Condition: Working, Repairable, or Dead")
    age_years: float = Field(..., ge=0, le=20, description="Age in years")
    weight_kg: float = Field(..., ge=0.01, le=50, description="Weight in kilograms")
    storage_gb: Optional[int] = Field(None, description="Storage capacity in GB")
    screen_size_inch: Optional[float] = Field(None, description="Screen size in inches")
    location_tier: Optional[int] = Field(1, ge=1, le=3, description="Location tier (1=metro, 2=city, 3=town)")

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    estimated_price: int
    green_points: int
    confidence: float
    breakdown: Dict[str, Any]
    model_version: str = "1.0.0"

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    version: str

@app.on_event("startup")
async def load_model():
    """Load ML model on startup"""
    global ml_model
    
    try:
        model_path = "models/ewaste_model.pkl"
        if os.path.exists(model_path):
            ml_model = EWastePricingModel()
            ml_model.load_model(model_path)
            logger.info("✅ ML model loaded successfully")
        else:
            logger.warning("⚠️ Model file not found. Training new model...")
            # Train a new model if none exists
            await train_new_model()
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        ml_model = None

async def train_new_model():
    """Train a new model if none exists"""
    global ml_model
    
    try:
        # Generate dataset if it doesn't exist
        if not os.path.exists("ewaste_pricing_dataset.csv"):
            logger.info("📊 Generating dataset...")
            from generate_dataset import generate_ewaste_dataset, add_feature_engineering
            import pandas as pd
            
            df = generate_ewaste_dataset(5000)
            df = add_feature_engineering(df)
            df.to_csv('ewaste_pricing_dataset.csv', index=False)
        
        # Train model
        logger.info("🔄 Training new model...")
        import pandas as pd
        df = pd.read_csv('ewaste_pricing_dataset.csv')
        
        ml_model = EWastePricingModel()
        ml_model.train(df)
        ml_model.save_model()
        
        logger.info("✅ New model trained and saved")
        
    except Exception as e:
        logger.error(f"❌ Failed to train new model: {e}")
        ml_model = None

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if ml_model and ml_model.is_trained else "unhealthy",
        model_loaded=ml_model is not None and ml_model.is_trained,
        version="1.0.0"
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_price_and_points(request: PredictionRequest):
    """Predict price and green points for e-waste item"""
    
    if not ml_model or not ml_model.is_trained:
        raise HTTPException(
            status_code=503, 
            detail="ML model not available. Please check service health."
        )
    
    try:
        # Convert request to dict
        product_data = request.dict()
        
        # Make prediction
        prediction = ml_model.predict(product_data)
        
        # Create detailed breakdown
        breakdown = create_prediction_breakdown(product_data, prediction)
        
        return PredictionResponse(
            estimated_price=prediction['estimated_price'],
            green_points=prediction['green_points'],
            confidence=prediction['confidence'],
            breakdown=breakdown
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

def create_prediction_breakdown(product_data: Dict, prediction: Dict) -> Dict[str, Any]:
    """Create detailed breakdown of prediction"""
    
    # Base points calculation (simplified for explanation)
    base_price = prediction['estimated_price']
    base_points = base_price // 10
    
    # Condition bonus
    condition_bonuses = {'Working': 30, 'Repairable': 15, 'Dead': 5}
    condition_bonus = condition_bonuses.get(product_data['condition'], 10)
    
    # Weight bonus
    weight_bonus = round(product_data['weight_kg'] * 2)
    
    # Brand bonus
    premium_brands = ['Apple', 'Samsung', 'Dell', 'Sony', 'MSI']
    brand_bonus = 10 if product_data['brand'] in premium_brands else 5
    
    # Environmental impact bonus
    env_bonus = 15 if base_price > 5000 else 10
    
    return {
        "base_points": base_points,
        "condition_bonus": condition_bonus,
        "weight_bonus": weight_bonus,
        "brand_bonus": brand_bonus,
        "environmental_bonus": env_bonus,
        "total_points": prediction['green_points'],
        "price_factors": {
            "product_type": product_data['product_type'],
            "brand_tier": "Premium" if product_data['brand'] in premium_brands else "Budget",
            "condition_impact": f"{product_data['condition']} condition",
            "age_depreciation": f"{product_data['age_years']} years old",
            "location_factor": f"Tier {product_data.get('location_tier', 1)} city"
        },
        "confidence_level": "High" if prediction['confidence'] > 0.8 else "Medium" if prediction['confidence'] > 0.6 else "Low"
    }

@app.get("/model/info")
async def get_model_info():
    """Get information about the loaded model"""
    
    if not ml_model or not ml_model.is_trained:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_type": "Random Forest Regressor",
        "features_count": len(ml_model.feature_columns) if ml_model.feature_columns else 0,
        "supported_products": [
            "Smartphone", "Laptop", "Tablet", "Monitor", "Headphones",
            "Charger", "Battery", "Keyboard", "Mouse", "Speaker"
        ],
        "supported_brands": list(ml_model.label_encoders.get('brand', {}).classes_ if 'brand' in ml_model.label_encoders else []),
        "supported_conditions": ["Working", "Repairable", "Dead"],
        "version": "1.0.0"
    }

@app.post("/retrain")
async def retrain_model():
    """Retrain the model with latest data"""
    
    try:
        await train_new_model()
        return {"message": "Model retrained successfully", "status": "success"}
    except Exception as e:
        logger.error(f"Retraining failed: {e}")
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "Green Points ML Service",
        "version": "1.0.0",
        "description": "AI-powered e-waste pricing and green points prediction",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "model_info": "/model/info",
            "retrain": "/retrain"
        },
        "status": "running"
    }

# Error handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return HTTPException(status_code=400, detail=str(exc))

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
