# 🟢 Green Points System

A comprehensive e-waste rewards system that incentivizes responsible electronic waste recycling through a points-based reward system.

**Developed by:** Mukund Chavan  
**Project:** sortUs E-Waste Rewards System

## 🌟 Features

### Core Functionality
- **E-Waste Submission**: Users can submit electronic waste with photos and details
- **Green Points Calculation**: Intelligent points calculation based on item type, condition, quantity, and user frequency
- **Digital Wallet**: Secure storage and management of Green Points
- **Rewards Redemption**: Redeem points for eco-friendly products and discounts
- **Transaction History**: Complete audit trail of all points transactions

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant points calculation and balance updates
- **User Dashboard**: Comprehensive overview of points, statistics, and recent activity
- **Profile Management**: Complete user profile and preferences management

### Technical Features
- **JWT Authentication**: Secure user authentication and session management
- **RESTful API**: Well-structured backend API with comprehensive endpoints
- **MongoDB Integration**: Robust data storage with user wallet schema
- **Real-time Validation**: Input validation and error handling
- **Export Functionality**: CSV export of transaction history

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

### 🧠 ML Service (Python)
- **FastAPI** - High-performance Python API framework
- **scikit-learn** - Machine learning library with Random Forest
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

## 🏗️ Architecture

### Backend (Node.js + Express)
```
server/
├── index.js                 # Main server file
├── models/
│   └── User.js              # User schema with Green Wallet
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── points.js            # Green Points operations
│   └── user.js              # User management
├── middleware/
│   └── auth.js              # JWT authentication middleware
└── utils/
    └── pointsCalculator.js  # Points calculation logic
```

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Application pages
│   ├── services/            # API service layer
│   ├── context/             # React context providers
│   └── utils/               # Utility functions
└── public/                  # Static assets
```

### 🧠 ML Service (Python + FastAPI)
```
ml_service/
├── main.py                  # FastAPI application
├── train_model.py           # ML model training
├── generate_dataset.py      # Dataset generation
├── requirements.txt         # Python dependencies
├── models/                  # Trained model storage
│   └── ewaste_model.pkl     # Serialized ML model
└── Dockerfile              # Container configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd green-points
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   **Backend (.env)**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```
   
   **Frontend (.env)**
   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud connection
   ```

5. **Setup ML Service (AI-Powered Pricing)**
   ```bash
   # Quick setup with script
   chmod +x setup_ml_service.sh
   ./setup_ml_service.sh

   # Or manual setup:
   cd ml_service
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python generate_dataset.py
   python train_model.py
   ```

6. **Run the application**
   ```bash
   # Option 1: Full stack with ML (recommended)
   # Terminal 1: Start ML service
   cd ml_service && source venv/bin/activate && python main.py

   # Terminal 2: Start backend and frontend
   npm run dev

   # Option 2: Without ML (fallback mode)
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - ML Service: http://localhost:8000 (if running)

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

## 🌍 Environmental Impact

This system contributes to environmental sustainability by:
- Encouraging responsible e-waste disposal
- Reducing electronic pollution
- Promoting circular economy principles
- Educating users about environmental impact
- Incentivizing sustainable behavior through rewards

**Together, we're building a greener future! 🌱**
