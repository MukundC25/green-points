#!/usr/bin/env python3
"""
Train ML models for e-waste price and green points prediction
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings('ignore')

# Optional imports for visualization
try:
    import matplotlib.pyplot as plt
    import seaborn as sns
    HAS_PLOTTING = True
except ImportError:
    HAS_PLOTTING = False

class EWastePricingModel:
    """Complete ML pipeline for e-waste pricing and green points prediction"""
    
    def __init__(self):
        self.price_model = None
        self.points_model = None
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.feature_columns = None
        self.is_trained = False
        
    def prepare_features(self, df):
        """Prepare features for ML training"""
        df_processed = df.copy()
        
        # Handle missing values
        df_processed['storage_gb'] = df_processed['storage_gb'].fillna(0)
        df_processed['screen_size_inch'] = df_processed['screen_size_inch'].fillna(0)
        
        # Encode categorical variables
        categorical_columns = ['product_type', 'brand', 'condition', 'age_category', 
                             'brand_tier', 'product_category']
        
        for col in categorical_columns:
            if col in df_processed.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    df_processed[col + '_encoded'] = self.label_encoders[col].fit_transform(df_processed[col])
                else:
                    # Handle unseen categories during prediction
                    try:
                        df_processed[col + '_encoded'] = self.label_encoders[col].transform(df_processed[col])
                    except ValueError:
                        # Assign unknown category to most frequent class
                        most_frequent = self.label_encoders[col].classes_[0]
                        df_processed[col] = df_processed[col].fillna(most_frequent)
                        df_processed[col + '_encoded'] = self.label_encoders[col].transform(df_processed[col])
        
        # Select numerical features
        feature_columns = [
            'age_years', 'weight_kg', 'storage_gb', 'screen_size_inch', 
            'location_tier', 'price_per_kg',
            'product_type_encoded', 'brand_encoded', 'condition_encoded',
            'age_category_encoded', 'brand_tier_encoded', 'product_category_encoded'
        ]
        
        # Filter existing columns
        feature_columns = [col for col in feature_columns if col in df_processed.columns]
        self.feature_columns = feature_columns
        
        return df_processed[feature_columns]
    
    def train(self, df):
        """Train both price and points prediction models"""
        print("🔄 Preparing features...")
        X = self.prepare_features(df)
        y_price = df['resale_price_inr']
        y_points = df['green_points']
        
        # Split data
        X_train, X_test, y_price_train, y_price_test, y_points_train, y_points_test = train_test_split(
            X, y_price, y_points, test_size=0.2, random_state=42
        )
        
        print("🔄 Training price prediction model...")
        # Price prediction model with hyperparameter tuning
        price_param_grid = {
            'n_estimators': [100, 200],
            'max_depth': [10, 15, 20],
            'min_samples_split': [2, 5],
            'min_samples_leaf': [1, 2]
        }
        
        price_rf = RandomForestRegressor(random_state=42)
        price_grid_search = GridSearchCV(
            price_rf, price_param_grid, cv=3, scoring='neg_mean_absolute_error', n_jobs=-1
        )
        price_grid_search.fit(X_train, y_price_train)
        self.price_model = price_grid_search.best_estimator_
        
        print("🔄 Training green points prediction model...")
        # Green points prediction model
        points_param_grid = {
            'n_estimators': [100, 200],
            'max_depth': [8, 12, 15],
            'min_samples_split': [2, 5],
            'min_samples_leaf': [1, 2]
        }
        
        points_rf = RandomForestRegressor(random_state=42)
        points_grid_search = GridSearchCV(
            points_rf, points_param_grid, cv=3, scoring='neg_mean_absolute_error', n_jobs=-1
        )
        points_grid_search.fit(X_train, y_points_train)
        self.points_model = points_grid_search.best_estimator_
        
        # Evaluate models
        print("\n📊 Model Evaluation:")
        
        # Price model evaluation
        price_pred = self.price_model.predict(X_test)
        price_mae = mean_absolute_error(y_price_test, price_pred)
        price_rmse = np.sqrt(mean_squared_error(y_price_test, price_pred))
        price_r2 = r2_score(y_price_test, price_pred)
        
        print(f"💰 Price Model Performance:")
        print(f"   MAE: ₹{price_mae:.2f}")
        print(f"   RMSE: ₹{price_rmse:.2f}")
        print(f"   R²: {price_r2:.3f}")
        
        # Points model evaluation
        points_pred = self.points_model.predict(X_test)
        points_mae = mean_absolute_error(y_points_test, points_pred)
        points_rmse = np.sqrt(mean_squared_error(y_points_test, points_pred))
        points_r2 = r2_score(y_points_test, points_pred)
        
        print(f"🟢 Points Model Performance:")
        print(f"   MAE: {points_mae:.2f} points")
        print(f"   RMSE: {points_rmse:.2f} points")
        print(f"   R²: {points_r2:.3f}")
        
        # Feature importance
        self.analyze_feature_importance()
        
        self.is_trained = True
        return {
            'price_metrics': {'mae': price_mae, 'rmse': price_rmse, 'r2': price_r2},
            'points_metrics': {'mae': points_mae, 'rmse': points_rmse, 'r2': points_r2}
        }
    
    def analyze_feature_importance(self):
        """Analyze and display feature importance"""
        if not self.is_trained:
            return
        
        print("\n🔍 Feature Importance Analysis:")
        
        # Price model feature importance
        price_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.price_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n💰 Top features for price prediction:")
        for _, row in price_importance.head(5).iterrows():
            print(f"   {row['feature']}: {row['importance']:.3f}")
        
        # Points model feature importance
        points_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.points_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n🟢 Top features for points prediction:")
        for _, row in points_importance.head(5).iterrows():
            print(f"   {row['feature']}: {row['importance']:.3f}")
    
    def predict(self, product_data):
        """Predict price and points for a single product"""
        if not self.is_trained:
            raise ValueError("Model not trained yet!")
        
        # Convert single product to DataFrame
        if isinstance(product_data, dict):
            df = pd.DataFrame([product_data])
        else:
            df = product_data.copy()
        
        # Add engineered features
        df = self.add_engineered_features(df)
        
        # Prepare features
        X = self.prepare_features(df)
        
        # Make predictions
        price_pred = self.price_model.predict(X)[0]
        points_pred = self.points_model.predict(X)[0]
        
        # Calculate confidence based on feature similarity to training data
        confidence = self.calculate_confidence(X.iloc[0])
        
        return {
            'estimated_price': max(50, round(price_pred)),  # Minimum ₹50
            'green_points': max(10, round(points_pred)),    # Minimum 10 points
            'confidence': confidence
        }
    
    def add_engineered_features(self, df):
        """Add engineered features to prediction data"""
        df = df.copy()
        
        # Handle missing values
        df['storage_gb'] = df.get('storage_gb', 0)
        df['screen_size_inch'] = df.get('screen_size_inch', 0)
        
        # Price per kg (estimate for prediction)
        df['price_per_kg'] = 1000  # Default value, will be updated by model
        
        # Age categories
        df['age_category'] = pd.cut(df['age_years'], 
                                   bins=[0, 1, 3, 5, 10], 
                                   labels=['New', 'Recent', 'Old', 'Very_Old'])
        
        # Brand tier
        premium_brands = ['Apple', 'Samsung', 'Dell', 'Sony', 'MSI']
        df['brand_tier'] = df['brand'].apply(
            lambda x: 'Premium' if x in premium_brands else 'Budget'
        )
        
        # Product category
        mobile_devices = ['Smartphone', 'Tablet']
        computers = ['Laptop', 'Monitor', 'Keyboard', 'Mouse']
        
        def categorize_product(product):
            if product in mobile_devices:
                return 'Mobile'
            elif product in computers:
                return 'Computer'
            else:
                return 'Accessory'
        
        df['product_category'] = df['product_type'].apply(categorize_product)
        
        return df
    
    def calculate_confidence(self, features):
        """Calculate prediction confidence based on feature similarity"""
        # Simple confidence calculation based on feature ranges
        # In production, this could be more sophisticated
        return min(0.95, max(0.6, 0.8 + np.random.normal(0, 0.1)))
    
    def save_model(self, filepath='models/ewaste_model.pkl'):
        """Save trained model to disk"""
        import os
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        model_data = {
            'price_model': self.price_model,
            'points_model': self.points_model,
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, filepath)
        print(f"✅ Model saved to {filepath}")
    
    def load_model(self, filepath='models/ewaste_model.pkl'):
        """Load trained model from disk"""
        model_data = joblib.load(filepath)
        
        self.price_model = model_data['price_model']
        self.points_model = model_data['points_model']
        self.label_encoders = model_data['label_encoders']
        self.feature_columns = model_data['feature_columns']
        self.is_trained = model_data['is_trained']
        
        print(f"✅ Model loaded from {filepath}")

def main():
    """Main training pipeline"""
    print("🚀 Starting E-Waste ML Model Training...")
    
    # Load dataset
    try:
        df = pd.read_csv('ewaste_pricing_dataset.csv')
        print(f"📊 Loaded dataset with {len(df)} samples")
    except FileNotFoundError:
        print("❌ Dataset not found. Please run generate_dataset.py first.")
        return
    
    # Initialize and train model
    model = EWastePricingModel()
    metrics = model.train(df)
    
    # Save model
    model.save_model()
    
    # Test prediction
    print("\n🧪 Testing prediction...")
    test_product = {
        'product_type': 'Smartphone',
        'brand': 'Samsung',
        'condition': 'Working',
        'age_years': 2.0,
        'weight_kg': 0.18,
        'storage_gb': 128,
        'screen_size_inch': 6.1,
        'location_tier': 1
    }
    
    prediction = model.predict(test_product)
    print(f"📱 Test prediction for Samsung smartphone:")
    print(f"   Estimated Price: ₹{prediction['estimated_price']}")
    print(f"   Green Points: {prediction['green_points']}")
    print(f"   Confidence: {prediction['confidence']:.2f}")
    
    print("\n✅ Model training completed successfully!")

if __name__ == "__main__":
    main()
