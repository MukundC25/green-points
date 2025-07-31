from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Simple ML Test")

class PredictionRequest(BaseModel):
    product_type: str
    brand: str
    condition: str
    age: int
    weight: float

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ML Service"}

@app.post("/predict")
async def predict_price(request: PredictionRequest):
    # Enhanced prediction logic

    # Base prices by product type (more realistic)
    base_prices = {
        "smartphone": 12000, "laptop": 25000, "tablet": 8000, "monitor": 6000,
        "desktop": 18000, "tv": 15000, "camera": 8000, "gaming console": 10000,
        "smartwatch": 4000, "headphones": 2000
    }

    base_price = base_prices.get(request.product_type.lower(), 8000)

    # Brand multipliers (more sophisticated)
    premium_brands = ["apple", "samsung", "dell", "sony", "msi", "hp", "lenovo"]
    brand_multiplier = 1.4 if request.brand.lower() in premium_brands else 0.8

    # Condition multipliers (more realistic)
    condition_multipliers = {
        "working": 0.75, "excellent": 0.85, "good": 0.65,
        "repairable": 0.45, "fair": 0.35, "poor": 0.25, "dead": 0.15
    }
    condition_multiplier = condition_multipliers.get(request.condition.lower(), 0.5)

    # Age depreciation (15% per year, more realistic)
    age_factor = max(0.1, 1 - (request.age * 0.15))

    # Weight bonus (heavier items often more valuable)
    weight_bonus = 1 + (request.weight * 0.05)

    # Calculate predicted price
    predicted_price = base_price * brand_multiplier * condition_multiplier * age_factor * weight_bonus

    # Add some realistic variance
    import random
    predicted_price *= random.uniform(0.9, 1.1)

    # Calculate green points (10% of price + bonuses)
    base_points = int(predicted_price * 0.1)
    condition_bonus = {"working": 20, "excellent": 25, "good": 15, "repairable": 10}.get(request.condition.lower(), 5)
    weight_bonus_points = int(request.weight * 2)

    green_points = base_points + condition_bonus + weight_bonus_points

    # Confidence based on data quality
    confidence = 0.88 if request.brand.lower() in premium_brands else 0.82

    return {
        "predicted_price": round(predicted_price, 2),
        "green_points": green_points,
        "confidence": confidence,
        "breakdown": {
            "base_price": base_price,
            "brand_factor": brand_multiplier,
            "condition_factor": condition_multiplier,
            "age_factor": age_factor,
            "weight_bonus": weight_bonus,
            "condition_bonus": condition_bonus,
            "weight_bonus_points": weight_bonus_points
        },
        "model_used": "enhanced_prediction_model"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
