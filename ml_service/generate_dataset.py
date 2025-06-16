#!/usr/bin/env python3
"""
Generate realistic e-waste pricing dataset for Green Points ML model
Based on real market patterns from Kaggle datasets and industry data
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

def generate_ewaste_dataset(n_samples=5000):
    """Generate realistic e-waste pricing dataset"""
    
    # Product categories with base prices (in INR)
    product_types = {
        'Smartphone': {'base_price': 15000, 'variance': 0.6},
        'Laptop': {'base_price': 35000, 'variance': 0.7},
        'Tablet': {'base_price': 20000, 'variance': 0.5},
        'Monitor': {'base_price': 12000, 'variance': 0.4},
        'Headphones': {'base_price': 3000, 'variance': 0.8},
        'Charger': {'base_price': 800, 'variance': 0.3},
        'Battery': {'base_price': 1500, 'variance': 0.4},
        'Keyboard': {'base_price': 2000, 'variance': 0.5},
        'Mouse': {'base_price': 1000, 'variance': 0.6},
        'Speaker': {'base_price': 4000, 'variance': 0.7}
    }
    
    # Brand tiers affecting price
    brand_multipliers = {
        'Apple': 1.8, 'Samsung': 1.4, 'Dell': 1.3, 'HP': 1.2, 'Lenovo': 1.1,
        'Sony': 1.3, 'LG': 1.1, 'Xiaomi': 0.8, 'OnePlus': 1.2, 'Realme': 0.7,
        'Asus': 1.2, 'Acer': 1.0, 'MSI': 1.3, 'Generic': 0.6, 'Local': 0.5
    }
    
    # Condition impact on resale value
    condition_multipliers = {
        'Working': 0.65,      # 65% of original price
        'Repairable': 0.35,   # 35% of original price  
        'Dead': 0.15          # 15% of original price (parts value)
    }
    
    data = []
    
    for _ in range(n_samples):
        # Random product selection
        product_type = random.choice(list(product_types.keys()))
        brand = random.choice(list(brand_multipliers.keys()))
        condition = random.choices(
            ['Working', 'Repairable', 'Dead'],
            weights=[0.4, 0.35, 0.25]  # More working items
        )[0]
        
        # Product specifications
        base_info = product_types[product_type]
        base_price = base_info['base_price']
        
        # Age factor (0.5 to 8 years)
        age = round(np.random.exponential(2) + 0.5, 1)
        age = min(age, 8.0)  # Cap at 8 years
        
        # Weight based on product type (in kg)
        weight_ranges = {
            'Smartphone': (0.15, 0.25), 'Laptop': (1.5, 3.0), 'Tablet': (0.4, 0.8),
            'Monitor': (3.0, 8.0), 'Headphones': (0.2, 0.5), 'Charger': (0.1, 0.3),
            'Battery': (0.3, 0.8), 'Keyboard': (0.5, 1.2), 'Mouse': (0.1, 0.2),
            'Speaker': (1.0, 3.0)
        }
        weight = round(np.random.uniform(*weight_ranges[product_type]), 2)
        
        # Calculate resale price
        # Base price * brand multiplier * condition multiplier * age depreciation
        age_depreciation = max(0.1, 1 - (age * 0.12))  # 12% depreciation per year
        
        resale_price = (
            base_price * 
            brand_multipliers[brand] * 
            condition_multipliers[condition] * 
            age_depreciation *
            np.random.uniform(0.8, 1.2)  # Market variance
        )
        
        # Add some noise and ensure minimum price
        resale_price = max(50, round(resale_price))
        
        # Storage size for relevant devices
        storage_gb = None
        if product_type in ['Smartphone', 'Laptop', 'Tablet']:
            storage_options = [32, 64, 128, 256, 512, 1024]
            storage_gb = random.choice(storage_options)
            if storage_gb >= 256:
                resale_price *= 1.1  # Premium for higher storage
        
        # Screen size for relevant devices
        screen_size = None
        if product_type in ['Smartphone', 'Laptop', 'Tablet', 'Monitor']:
            screen_ranges = {
                'Smartphone': (5.0, 6.8), 'Laptop': (13.0, 17.0),
                'Tablet': (8.0, 12.9), 'Monitor': (19.0, 32.0)
            }
            screen_size = round(np.random.uniform(*screen_ranges[product_type]), 1)
        
        # Location factor (tier 1/2/3 cities)
        location_tier = random.choices([1, 2, 3], weights=[0.3, 0.4, 0.3])[0]
        location_multiplier = {1: 1.1, 2: 1.0, 3: 0.9}[location_tier]
        resale_price *= location_multiplier
        
        # Final price rounding
        resale_price = round(resale_price)
        
        # Calculate green points (our target for ML)
        # Base: 1 point per ₹10 + bonuses
        base_points = resale_price // 10
        
        # Condition bonus
        condition_bonus = {'Working': 30, 'Repairable': 15, 'Dead': 5}[condition]
        
        # Weight bonus (2 points per kg)
        weight_bonus = round(weight * 2)
        
        # Environmental impact bonus (higher for valuable electronics)
        env_bonus = 10 if resale_price > 5000 else 5
        
        green_points = base_points + condition_bonus + weight_bonus + env_bonus
        
        data.append({
            'product_type': product_type,
            'brand': brand,
            'condition': condition,
            'age_years': age,
            'weight_kg': weight,
            'storage_gb': storage_gb,
            'screen_size_inch': screen_size,
            'location_tier': location_tier,
            'resale_price_inr': resale_price,
            'green_points': green_points
        })
    
    return pd.DataFrame(data)

def add_feature_engineering(df):
    """Add engineered features for better ML performance"""
    
    # Price per kg (value density)
    df['price_per_kg'] = df['resale_price_inr'] / df['weight_kg']
    
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
    accessories = ['Headphones', 'Charger', 'Battery', 'Speaker']
    
    def categorize_product(product):
        if product in mobile_devices:
            return 'Mobile'
        elif product in computers:
            return 'Computer'
        else:
            return 'Accessory'
    
    df['product_category'] = df['product_type'].apply(categorize_product)
    
    return df

if __name__ == "__main__":
    print("🔄 Generating e-waste pricing dataset...")
    
    # Generate dataset
    df = generate_ewaste_dataset(5000)
    df = add_feature_engineering(df)
    
    # Save dataset
    df.to_csv('ewaste_pricing_dataset.csv', index=False)
    
    print(f"✅ Dataset generated with {len(df)} samples")
    print(f"📊 Dataset shape: {df.shape}")
    print(f"💰 Price range: ₹{df['resale_price_inr'].min()} - ₹{df['resale_price_inr'].max()}")
    print(f"🟢 Points range: {df['green_points'].min()} - {df['green_points'].max()}")
    
    # Display sample data
    print("\n📋 Sample data:")
    print(df.head())
    
    # Basic statistics
    print("\n📈 Dataset statistics:")
    print(df.describe())
