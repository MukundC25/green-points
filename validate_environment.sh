#!/bin/bash

# Green Points System - Environment Validation Script
echo "🔍 Validating Green Points System Environment..."

ERRORS=0
WARNINGS=0

# Function to log error
log_error() {
    echo "❌ ERROR: $1"
    ERRORS=$((ERRORS + 1))
}

# Function to log warning
log_warning() {
    echo "⚠️  WARNING: $1"
    WARNINGS=$((WARNINGS + 1))
}

# Function to log success
log_success() {
    echo "✅ $1"
}

echo ""
echo "📋 Checking System Requirements..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js found: $NODE_VERSION"
    
    # Check if version is >= 16
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 16 ]; then
        log_warning "Node.js version should be >= 16.x for best compatibility"
    fi
else
    log_error "Node.js is not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_success "npm found: $NPM_VERSION"
else
    log_error "npm is not installed"
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    log_success "Python 3 found: $PYTHON_VERSION"
else
    log_error "Python 3 is not installed"
fi

# Check pip
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version 2>/dev/null || echo "pip3 available")
    log_success "pip3 found: $PIP_VERSION"
else
    log_error "pip3 is not installed"
fi

# Check MongoDB
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n1)
    log_success "MongoDB found: $MONGO_VERSION"
else
    log_warning "MongoDB not found in PATH. You can use MongoDB Atlas instead."
fi

echo ""
echo "📁 Checking Project Structure..."

# Check main directories
for dir in "server" "client" "ml_service"; do
    if [ -d "$dir" ]; then
        log_success "Directory '$dir' exists"
    else
        log_error "Directory '$dir' is missing"
    fi
done

# Check important files
declare -a files=(
    "package.json"
    "server/package.json"
    "client/package.json"
    "ml_service/requirements.txt"
    "server/.env"
    "client/.env"
    "ml_service/.env"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        log_success "File '$file' exists"
    else
        log_error "File '$file' is missing"
    fi
done

echo ""
echo "🔧 Checking Dependencies..."

# Check Node.js dependencies
if [ -d "node_modules" ]; then
    log_success "Root node_modules exists"
else
    log_warning "Root node_modules missing - run 'npm install'"
fi

if [ -d "server/node_modules" ]; then
    log_success "Server node_modules exists"
else
    log_warning "Server node_modules missing - run 'cd server && npm install'"
fi

if [ -d "client/node_modules" ]; then
    log_success "Client node_modules exists"
else
    log_warning "Client node_modules missing - run 'cd client && npm install'"
fi

# Check Python virtual environment
if [ -d "ml_service/venv" ]; then
    log_success "ML service virtual environment exists"
else
    log_warning "ML service venv missing - run './setup_ml_service.sh'"
fi

# Check ML model
if [ -f "ml_service/models/ewaste_model.pkl" ]; then
    log_success "ML model exists"
else
    log_warning "ML model missing - will be created on first run"
fi

echo ""
echo "🌐 Checking Port Availability..."

# Function to check if port is available
check_port_available() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port $port ($service) is already in use"
    else
        log_success "Port $port ($service) is available"
    fi
}

check_port_available 5000 "Backend"
check_port_available 5173 "Frontend"
check_port_available 8000 "ML Service"
check_port_available 27017 "MongoDB"

echo ""
echo "📊 Validation Summary"
echo "===================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 Perfect! Your environment is ready to run Green Points System."
    echo ""
    echo "🚀 To start the system:"
    echo "   ./start_with_ml.sh"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "✅ Environment is mostly ready with $WARNINGS warning(s)."
    echo "   You can proceed, but consider fixing the warnings."
    echo ""
    echo "🚀 To start the system:"
    echo "   ./start_with_ml.sh"
    exit 0
else
    echo "❌ Found $ERRORS error(s) and $WARNINGS warning(s)."
    echo "   Please fix the errors before running the system."
    echo ""
    echo "🔧 Common fixes:"
    echo "   - Install missing dependencies: npm run install-all"
    echo "   - Setup ML service: ./setup_ml_service.sh"
    echo "   - Create missing .env files from .env.example"
    exit 1
fi
