#!/bin/bash

# Green Points ML Service Setup Script
# This script sets up the ML service for AI-powered e-waste pricing

echo "🚀 Setting up Green Points ML Service..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.8+ and try again."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    echo "Please install pip3 and try again."
    exit 1
fi

echo "✅ pip3 found"

# Create virtual environment
echo "🔄 Creating Python virtual environment..."
cd ml_service
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "🔄 Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "🔄 Installing Python dependencies..."
pip install -r requirements.txt

# Generate dataset
echo "🔄 Generating e-waste pricing dataset..."
python generate_dataset.py

# Train ML model
echo "🔄 Training ML models..."
python train_model.py

# Test the service
echo "🧪 Testing ML service..."
python -c "
from train_model import EWastePricingModel
import os

if os.path.exists('models/ewaste_model.pkl'):
    model = EWastePricingModel()
    model.load_model()
    
    test_data = {
        'product_type': 'Smartphone',
        'brand': 'Samsung',
        'condition': 'Working',
        'age_years': 2.0,
        'weight_kg': 0.18,
        'storage_gb': 128,
        'screen_size_inch': 6.1,
        'location_tier': 1
    }
    
    result = model.predict(test_data)
    print(f'✅ Model test successful!')
    print(f'   Predicted Price: ₹{result[\"estimated_price\"]}')
    print(f'   Green Points: {result[\"green_points\"]}')
    print(f'   Confidence: {result[\"confidence\"]:.2f}')
else:
    print('❌ Model file not found')
    exit(1)
"

if [ $? -eq 0 ]; then
    echo "✅ ML service setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Start the ML service: cd ml_service && source venv/bin/activate && python main.py"
    echo "2. The service will run on http://localhost:8000"
    echo "3. Your Node.js backend will automatically connect to it"
    echo ""
    echo "🔧 To start the ML service now:"
    echo "   cd ml_service"
    echo "   source venv/bin/activate"
    echo "   python main.py"
else
    echo "❌ ML service setup failed!"
    exit 1
fi
