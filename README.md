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

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📊 Green Points Calculation

The points calculation system follows this logic:

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

### Green Points
- `POST /api/points/submit` - Submit e-waste and earn points
- `POST /api/points/redeem` - Redeem points for rewards
- `GET /api/points/balance` - Get user's points balance
- `GET /api/points/history` - Get transaction history
- `POST /api/points/calculate` - Calculate points preview

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
sortUs E-Waste Solutions

---

## 🌍 Environmental Impact

This system contributes to environmental sustainability by:
- Encouraging responsible e-waste disposal
- Reducing electronic pollution
- Promoting circular economy principles
- Educating users about environmental impact
- Incentivizing sustainable behavior through rewards

**Together, we're building a greener future! 🌱**
