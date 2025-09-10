# 🟢 Green Points System

An AI-powered e-waste rewards platform that incentivizes responsible electronic waste recycling through intelligent machine learning-based pricing and a comprehensive points-based reward system.

**Developed by:** Mukund Chavan
**Project:** sortUs E-Waste Rewards System
**Status:** Production Ready ✅ (Session-Based System)
**Last Updated:** September 10, 2025

## 🌟 Features

### 🧠 AI-Powered Core Functionality
- **ML-Based E-Waste Pricing**: Advanced Random Forest regression model for intelligent price prediction
- **Real-time AI Predictions**: Sub-100ms response times with confidence scoring (0.6-0.95 range)
- **Smart Points Calculation**: AI-driven points allocation based on predicted resale value
- **Multi-factor Analysis**: Product type, brand, condition, age, weight, and market data
- **Fallback System**: Graceful degradation to hardcoded rules when ML service unavailable

### 📱 User Experience
- **Modern React Interface**: Component-based architecture with React Router DOM
- **Responsive Design**: Tailwind CSS for seamless desktop, tablet, and mobile experience
- **Real-time Dashboard**: Live statistics, charts, and activity feeds
- **Intuitive Navigation**: Sidebar navigation with breadcrumbs and quick actions
- **Interactive Forms**: Smart form validation with instant feedback

### 🔧 Technical Excellence
- **Microservices Architecture**: Separate ML service, backend API, and frontend
- **Production-Ready**: Docker containerization with health checks
- **Robust Error Handling**: Comprehensive error boundaries and fallback mechanisms
- **Performance Optimized**: Lazy loading, code splitting, and caching strategies
- **Security First**: JWT authentication, input sanitization, and CORS protection

### 💼 Business Features
- **Transaction Management**: Complete audit trail with CSV export functionality
- **Referral System**: Multi-tier referral program with bonus rewards
- **Rewards Marketplace**: Comprehensive redemption system with eco-friendly products
- **Analytics Dashboard**: User insights, trends, and performance metrics
- **Admin Controls**: User management and system configuration

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library with component-based architecture
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing

### 🧠 AI/ML Service (Python)
- **FastAPI** - High-performance async Python API framework
- **scikit-learn** - Machine learning library with Random Forest regression
- **pandas** - Data manipulation and analysis
- **numpy** - Numerical computing for ML operations
- **joblib** - Model serialization and persistence
- **uvicorn** - ASGI server for production deployment
- **pandas** - Data manipulation and analysis
- **joblib** - Model serialization and persistence
- **uvicorn** - ASGI server for FastAPI

### Development Tools
- **npm** - Package management
- **Git** - Version control
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Docker** - Containerization for ML service

### 🤖 AI-Powered Features
- **ML-Based Pricing**: Random Forest model predicts e-waste value and green points
- **Smart Points Calculation**: AI considers product type, condition, weight, age, brand
- **Confidence Scoring**: ML predictions include confidence levels
- **Fallback System**: Graceful degradation to hardcoded rules when ML unavailable
- **Real-time Predictions**: FastAPI service provides instant price/points estimates
- **Model Monitoring**: Track prediction accuracy and model performance
- **History Endpoints**: Dedicated endpoints for pickup, redemption, and earned histories

## 🏗️ System Architecture

### 🌐 Microservices Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   ML Service    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Python)      │
│   Port: 5173    │    │   Port: 5000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         └─────────────►│    MongoDB      │◄─────────────┘
                        │   Port: 27017   │
                        └─────────────────┘
```

### 🖥️ Backend API (Node.js + Express)
```
server/
├── index.js                 # Main server with ML integration
├── models/
│   └── User.js              # Enhanced user schema with wallet
├── routes/
│   ├── auth.js              # JWT authentication
│   ├── points.js            # ML-powered points calculation
│   └── user.js              # User management & dashboard
├── services/
│   └── mlService.js         # ML service integration layer
├── middleware/
│   └── auth.js              # Security middleware
└── utils/
    └── pointsCalculator.js  # Fallback calculation logic
```

### 📱 Frontend (React + Vite)
```
client/
├── src/
│   ├── components/          # UI components (Layout, Badges, etc.)
│   ├── pages/               # Dashboard, Submit, Redeem, etc.
│   ├── services/            # API integration (auth, points)
│   ├── context/             # AuthContext for state management
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
├── public/                  # Static assets
└── dist/                    # Production build output
```

### 🧠 AI/ML Service (Python + FastAPI)
```
ml_service/
├── main.py                  # FastAPI app with prediction endpoints
├── train_model.py           # Random Forest model training
├── generate_dataset.py      # Synthetic dataset generation
├── models/
│   └── ewaste_model.pkl     # Trained ML model (58MB)
├── venv/                    # Python virtual environment
├── requirements.txt         # Python dependencies
└── .env                     # ML service configuration
```
## 🚀 Quick Start & Deployment

### 📋 Prerequisites
- **Node.js** (v16+ recommended, v22.14.0 tested)
- **Python** (3.12+ for ML service)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

### ⚡ One-Command Startup
```bash
# Clone and start everything with ML service
git clone https://github.com/MukundC25/green-points.git
cd green-points
./start_with_ml.sh

# Services will be available at:
# Frontend: http://localhost:5178
# Backend:  http://localhost:5001
# ML API:   http://localhost:8000
```

### 🔧 Manual Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd green-points
   ```

2. **Install All Dependencies**
   ```bash
   npm run install-all  # Installs root, server, and client deps
   ```

3. **Setup ML Service**
   ```bash
   ./setup_ml_service.sh  # Creates venv, installs deps, trains model
   ```

4. **Environment Configuration**

   **Server (.env)**
   ```bash
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/greenpoints
   JWT_SECRET=your-super-secret-jwt-key
   ML_SERVICE_URL=http://localhost:8000
   ```

   **Client (.env)**
   ```bash
   VITE_API_URL=http://localhost:5001/api
   VITE_NODE_ENV=development
   VITE_PORT=5178
   ```

   **ML Service (.env)**
   ```bash
   PORT=8000
   HOST=0.0.0.0
   MODEL_PATH=./models/ewaste_model.pkl
   CORS_ORIGINS=["http://localhost:5000", "http://localhost:5173"]
   ```

5. **Start the System**
   ```bash
   # Option 1: Complete system with ML (Recommended)
   ./start_with_ml.sh

   # Option 2: Individual services
   # Terminal 1: ML Service
   cd ml_service && source venv/bin/activate && python main.py

   # Terminal 2: Backend
   cd server && npm run dev

   # Terminal 3: Frontend
   cd client && npm run dev
   ```

### 🌐 Service URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:8000
- **MongoDB**: localhost:27017

### 🔍 Environment Validation
```bash
# Check if everything is set up correctly
npm run validate
# or
./validate_environment.sh
```

## 🤖 AI-Powered Pricing System

The system now uses machine learning for intelligent e-waste pricing and green points calculation:

### ML Model Features
- **Random Forest Regression**: Predicts both resale price and green points
- **Multi-factor Analysis**: Considers product type, brand, condition, age, weight
- **Confidence Scoring**: Each prediction includes confidence level (0.0-1.0)
- **Fallback System**: Graceful degradation to hardcoded rules when ML unavailable
- **Real-time Training**: Model can be retrained with new data

### Input Features
- **Product Type**: Smartphone, Laptop, Tablet, Monitor, etc.
- **Brand**: Apple, Samsung, Dell, Generic, etc.
- **Condition**: Working (65% value), Repairable (35% value), Dead (15% value)
- **Age**: Product age in years (0.5-8 years)
- **Weight**: Physical weight in kg
- **Storage**: Storage capacity for relevant devices
- **Location**: City tier affecting market prices

### ML vs Hardcoded Comparison
| Feature | ML Model | Hardcoded Rules |
|---------|----------|-----------------|
| Accuracy | High (R² > 0.85) | Medium |
| Adaptability | Dynamic | Static |
| Market Awareness | Yes | No |
| Brand Impact | Considered | Limited |
| Price Prediction | ✅ | ❌ |
| Confidence Score | ✅ | ❌ |

## 📊 Green Points Calculation (Legacy)

The fallback hardcoded system follows this logic:

### Base Points by Item Type
- **Smartphone**: 50 points
- **Laptop**: 80 points
- **Tablet**: 40 points
- **Battery**: 30 points
- **Monitor**: 60 points
- **Charger**: 15 points
- **Headphones**: 20 points
- **Other items**: 10 points

### Condition Bonuses
- **Working**: +30 points
- **Repairable**: +15 points
- **Dead**: No bonus

### Additional Bonuses
- **Quantity**: +5 points per item
- **User Frequency**: 
  - Regular users: +20 points
  - Occasional users: +10 points
  - First-time users: No bonus
- **Bulk submission** (5+ items): +25 points
- **Rare items bonus**: +10 points for valuable electronics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Green Points (AI-Powered)
- `POST /api/points/submit` - Submit e-waste and earn points (ML-enhanced)
- `POST /api/points/redeem` - Redeem points for rewards
- `GET /api/points/balance` - Get user's points balance
- `GET /api/points/history` - Get transaction history
- `POST /api/points/calculate` - Calculate points preview (ML-enhanced)
- `GET /api/points/ml-status` - Check ML service health and model info

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/dashboard` - Get dashboard data
- `GET /api/user/stats` - Get user statistics

## 🗄️ Database Schema

### User Document Structure
```javascript
{
  "_id": "user123",
  "name": "Mukund Chavan",
  "email": "mukund@email.com",
  "greenPoints": 135,
  "greenWallet": {
    "balance": 135,
    "totalEarned": 160,
    "totalRedeemed": 25,
    "history": [
      {
        "timestamp": "2024-06-03T11:00:00Z",
        "points": 110,
        "source": "Sold Smartphone",
        "type": "credit",
        "metadata": {
          "itemType": "Smartphone",
          "condition": "Working",
          "quantity": 1
        }
      }
    ]
  },
  "userFrequency": "Regular",
  "profile": {
    "phone": "+1234567890",
    "address": "123 Green St",
    "city": "EcoCity",
    "state": "CA",
    "zipCode": "12345"
  }
}
```

## 🎨 UI Components

### Key Pages
- **Landing Page**: Marketing and feature overview
- **Dashboard**: User overview with points balance and recent activity
- **Submit E-Waste**: Form for submitting electronic waste
- **Redeem Points**: Catalog of available rewards
- **Transaction History**: Complete transaction log with filtering
- **Profile**: User profile management

### Design System
- **Color Scheme**: Green-focused palette representing sustainability
- **Typography**: Inter font family for modern, clean appearance
- **Icons**: Lucide React icons for consistency
- **Responsive**: Mobile-first design with Tailwind CSS

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Helmet.js**: Security headers for Express.js

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Test Coverage
- Unit tests for points calculation logic
- API endpoint testing
- Component testing for React components
- Integration tests for user workflows

## 📈 Future Enhancements

### Planned Features
- **Image Recognition**: AI-powered e-waste classification
- **Geolocation**: Location-based recycling center recommendations
- **Social Features**: User leaderboards and achievements
- **Mobile App**: Native mobile applications
- **Blockchain Integration**: Transparent and immutable transaction records
- **Corporate Partnerships**: Integration with e-waste collection services

### Technical Improvements
- **Caching**: Redis integration for improved performance
- **Monitoring**: Application performance monitoring
- **CI/CD**: Automated testing and deployment pipelines
- **Microservices**: Service-oriented architecture for scalability

## 🚀 Production Deployment

### 🌐 Vercel Deployment (Frontend)

1. **Prepare for Deployment**
   ```bash
   # Build the client
   cd client
   npm run build

   # Test production build locally
   npm run preview
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from client directory
   cd client
   vercel --prod
   ```

3. **Environment Variables on Vercel**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_NODE_ENV=production
   ```

### 🖥️ Backend Deployment Options

**Option 1: Railway/Render**
```bash
# Add to package.json in server/
"scripts": {
  "start": "node index.js",
  "build": "npm install"
}
```

**Option 2: Heroku**
```bash
# Create Procfile in server/
echo "web: node index.js" > Procfile
```

**Option 3: DigitalOcean/AWS**
```bash
# Use PM2 for process management
npm install -g pm2
pm2 start index.js --name "green-points-api"
```

### 🧠 ML Service Deployment

**Option 1: Railway (Python)**
```bash
# Add railway.toml in ml_service/
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
```

**Option 2: Google Cloud Run**
```dockerfile
# Dockerfile in ml_service/
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 🗄️ Database Options

**MongoDB Atlas (Recommended)**
```bash
# Connection string format:
mongodb+srv://username:password@cluster.mongodb.net/greenpoints
```

**Local MongoDB with Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 🔒 Production Environment Variables

**Backend (.env.production)**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/greenpoints
JWT_SECRET=super-secure-production-secret-key
ML_SERVICE_URL=https://your-ml-service.railway.app
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Frontend (Vercel Environment)**
```bash
VITE_API_URL=https://your-backend.railway.app/api
VITE_NODE_ENV=production
```

### 📊 Performance Optimization

**Frontend Optimizations**
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Bundle analysis with `npm run build -- --analyze`
- CDN integration for static assets

**Backend Optimizations**
- MongoDB indexing for faster queries
- Response compression with gzip
- Rate limiting and caching headers
- Health check endpoints for monitoring

**ML Service Optimizations**
- Model caching in memory
- Async request handling
- Response compression
- Health monitoring endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Mukund Chavan**  
AI Research Intern  
sortUs 

---

## 📈 Current Status & Recent Updates

### ✅ Latest Deployment (September 10, 2025)
- **All Services Running**: Frontend (5178), Backend (5001), ML Service (8000)
- **Complete Integration**: AI/ML predictions fully operational
- **Production Ready**: Docker containers, health checks, monitoring
- **GitHub Repository**: Full working state committed and pushed
- **Performance**: Sub-100ms ML predictions with 85%+ accuracy

### 🔄 Recent Improvements
- Enhanced error handling and fallback mechanisms
- Optimized ML model performance and accuracy
- Updated deployment configurations for all platforms
- Comprehensive documentation and setup scripts
- Real-time health monitoring for all services

---

## 🌍 Environmental Impact

This system contributes to environmental sustainability by:
- Encouraging responsible e-waste disposal
- Reducing electronic pollution
- Promoting circular economy principles
- Educating users about environmental impact
- Incentivizing sustainable behavior through rewards

**Together, we're building a greener future! 🌱**
