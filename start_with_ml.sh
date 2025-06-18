#!/bin/bash

# Green Points System Startup Script with ML
# Starts all services: MongoDB, ML Service, Backend, Frontend

echo "🚀 Starting Green Points System with AI/ML..."

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to start within timeout"
    return 1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi
echo "✅ Python 3 found: $(python3 --version)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Make sure it's installed and running."
fi

# Check if ML model exists
if [ ! -f "ml_service/models/ewaste_model.pkl" ]; then
    echo "🔄 ML model not found. Setting up ML service..."
    chmod +x setup_ml_service.sh
    ./setup_ml_service.sh
    
    if [ $? -ne 0 ]; then
        echo "❌ ML service setup failed!"
        exit 1
    fi
fi

# Start MongoDB if not running
if ! check_port 27017; then
    echo "🔄 Starting MongoDB..."
    mongod --fork --logpath /tmp/mongodb.log --dbpath ./data/db 2>/dev/null || {
        echo "⚠️  Could not start MongoDB automatically. Please start it manually:"
        echo "   mongod --dbpath ./data/db"
        echo "   Or use MongoDB Atlas cloud connection"
    }
else
    echo "✅ MongoDB is already running on port 27017"
fi

# Create data directory if it doesn't exist
mkdir -p data/db

# Install Node.js dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "🔄 Installing Node.js dependencies..."
    npm run install-all
fi

# Start ML Service
echo "🧠 Starting ML Service..."
cd ml_service

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "❌ ML virtual environment not found. Please run setup_ml_service.sh first."
    exit 1
fi

# Start ML service in background
python main.py &
ML_PID=$!
echo "🔄 ML Service started with PID: $ML_PID"

cd ..

# Wait for ML service to be ready
if ! wait_for_service "http://localhost:8000/health" "ML Service"; then
    echo "❌ ML Service failed to start"
    kill $ML_PID 2>/dev/null
    exit 1
fi

# Start Backend
echo "🖥️  Starting Backend..."
cd server
npm run dev &
BACKEND_PID=$!
echo "🔄 Backend started with PID: $BACKEND_PID"
cd ..

# Wait for backend to be ready
if ! wait_for_service "http://localhost:3001/api/health" "Backend"; then
    echo "❌ Backend failed to start"
    kill $ML_PID $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start Frontend
echo "🎨 Starting Frontend..."
cd client
npm run dev &
FRONTEND_PID=$!
echo "🔄 Frontend started with PID: $FRONTEND_PID"
cd ..

# Wait for frontend to be ready
if ! wait_for_service "http://localhost:5173" "Frontend"; then
    echo "❌ Frontend failed to start"
    kill $ML_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

# Test the integration
echo "🧪 Testing ML integration..."
sleep 5  # Give services time to fully initialize

if command -v node &> /dev/null && [ -f "test_ml_integration.js" ]; then
    # Install test dependencies if needed
    if ! npm list colors &> /dev/null; then
        echo "📦 Installing test dependencies..."
        npm install colors
    fi
    
    node test_ml_integration.js
    TEST_RESULT=$?
    
    if [ $TEST_RESULT -eq 0 ]; then
        echo "✅ All integration tests passed!"
    else
        echo "⚠️  Some integration tests failed, but services are running."
    fi
else
    echo "⚠️  Integration tests skipped (missing dependencies)"
fi

# Display service information
echo ""
echo "🎉 Green Points System is running!"
echo "=================================="
echo "🌐 Frontend:    http://localhost:5173"
echo "🖥️  Backend:     http://localhost:3001"
echo "🧠 ML Service:  http://localhost:8000"
echo "📊 ML Docs:     http://localhost:8000/docs"
echo ""
echo "📋 Service PIDs:"
echo "   ML Service: $ML_PID"
echo "   Backend:    $BACKEND_PID"
echo "   Frontend:   $FRONTEND_PID"
echo ""
echo "🛑 To stop all services:"
echo "   kill $ML_PID $BACKEND_PID $FRONTEND_PID"
echo "   Or press Ctrl+C and run: pkill -f 'python main.py|npm run dev'"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $ML_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
echo ""
echo "✨ System is ready! Press Ctrl+C to stop all services."
echo "📱 Open http://localhost:5173 in your browser to start using the app."

# Wait for user to stop
wait
