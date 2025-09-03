#!/bin/bash
# Render ML Service Startup Script

echo "🚀 Starting Green Points ML Service..."

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
