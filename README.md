# 🟢 Green Points System

An AI-powered e-waste rewards platform that incentivizes responsible electronic waste recycling through intelligent machine learning-based pricing and a comprehensive points-based reward system.

**Developed by:** Mukund Chavan
**Project:** sortUs E-Waste Rewards System
**Status:** Production Ready ✅ (Session-Based System)
**Last Updated:** September 10, 2025

## 📐 UML Diagrams & Architecture

This README includes comprehensive UML diagrams to help understand the system architecture:

### 🎯 Diagram Index
1. **[High-Level Architecture](#-high-level-architecture-diagram)** - Overall system design with all layers
2. **[Component Interaction](#-component-interaction-diagram)** - Frontend component relationships
3. **[Sequence Diagrams](#-sequence-diagrams)** - E-Waste submission, authentication, and redemption flows
4. **[Entity-Relationship Diagram](#-entity-relationship-diagram)** - Database schema and relationships
5. **[Class Diagram](#-class-diagram-backend-models)** - Backend models and their methods
6. **[Deployment Architecture](#-deployment-architecture-diagram)** - Production and development environments
7. **[Data Flow Diagram](#-data-flow-diagram)** - Data processing pipeline
8. **[State Machines](#-e-waste-submission-state-machine)** - User workflows and state transitions
9. **[API Architecture](#️-api-architecture-diagram)** - API gateway and route structure
10. **[ML Model Architecture](#-ml-model-architecture)** - Machine learning pipeline
11. **[Technology Stack](#️-technology-stack-diagram)** - Complete tech stack visualization

> **Note**: All diagrams are created using Mermaid syntax and will render automatically on GitHub and other Markdown viewers that support Mermaid.

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

### 🏗️ Technology Stack Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend Layer"]
        React[React.js 18+]
        Vite[Vite 5.x]
        Tailwind[Tailwind CSS 3.x]
        Router[React Router DOM 6.x]
        Axios[Axios HTTP Client]
        Toast[React Hot Toast]
    end
    
    subgraph Backend["Backend Layer"]
        Node[Node.js 16+]
        Express[Express.js 4.x]
        Mongoose[Mongoose 8.x]
        JWT[JWT Auth]
        Bcrypt[bcryptjs]
        Session[Express Session]
        MongoStore[Connect-Mongo]
    end
    
    subgraph ML["ML/AI Layer"]
        Python[Python 3.12+]
        FastAPI[FastAPI 0.100+]
        Sklearn[scikit-learn]
        Pandas[Pandas]
        Numpy[NumPy]
        Joblib[Joblib]
        Uvicorn[Uvicorn ASGI]
    end
    
    subgraph Database["Database Layer"]
        MongoDB[(MongoDB 7.x)]
        Atlas[MongoDB Atlas Cloud]
    end
    
    subgraph DevTools["Development Tools"]
        NPM[npm/pnpm]
        Git[Git VCS]
        Docker[Docker]
        ESLint[ESLint]
        PostCSS[PostCSS]
    end
    
    subgraph Deployment["Deployment Platforms"]
        Vercel[Vercel - Frontend]
        Railway[Railway - Backend]
        Cloud[Google Cloud - ML]
    end
    
    React --> Vite
    React --> Tailwind
    React --> Router
    React --> Axios
    React --> Toast
    
    Express --> Node
    Express --> Mongoose
    Express --> JWT
    Express --> Bcrypt
    Express --> Session
    Session --> MongoStore
    
    FastAPI --> Python
    FastAPI --> Sklearn
    FastAPI --> Pandas
    FastAPI --> Numpy
    FastAPI --> Joblib
    FastAPI --> Uvicorn
    
    Mongoose --> MongoDB
    MongoStore --> MongoDB
    MongoDB --> Atlas
    
    style Frontend fill:#4fc3f7
    style Backend fill:#ffb74d
    style ML fill:#ba68c8
    style Database fill:#66bb6a
    style DevTools fill:#90caf9
    style Deployment fill:#ffab91
```

### 📦 Frontend Technologies
- **React.js 18+** - UI library with component-based architecture
- **Vite 5.x** - Fast build tool and development server
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **React Router DOM 6.x** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications

### 🖥️ Backend Technologies
- **Node.js 16+** - JavaScript runtime environment
- **Express.js 4.x** - Web application framework
- **MongoDB 7.x** - NoSQL document database
- **Mongoose 8.x** - MongoDB object modeling
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Express Session** - Session management
- **Connect-Mongo** - MongoDB session store

### 🧠 AI/ML Technologies (Python)
- **Python 3.12+** - Programming language
- **FastAPI 0.100+** - High-performance async Python API framework
- **scikit-learn** - Machine learning library with Random Forest regression
- **pandas** - Data manipulation and analysis
- **numpy** - Numerical computing for ML operations
- **joblib** - Model serialization and persistence
- **uvicorn** - ASGI server for production deployment

### 🛠️ Development Tools
- **npm** - Package management
- **Git** - Version control
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Docker** - Containerization for ML service

### ☁️ Deployment Platforms
- **Vercel** - Frontend hosting with CDN
- **Railway/Render** - Backend API hosting
- **Google Cloud Run** - ML service hosting
- **MongoDB Atlas** - Cloud database (M0 Free Tier)

### 🤖 AI-Powered Features
- **ML-Based Pricing**: Random Forest model predicts e-waste value and green points
- **Smart Points Calculation**: AI considers product type, condition, weight, age, brand
- **Confidence Scoring**: ML predictions include confidence levels
- **Fallback System**: Graceful degradation to hardcoded rules when ML unavailable
- **Real-time Predictions**: FastAPI service provides instant price/points estimates
- **Model Monitoring**: Track prediction accuracy and model performance
- **History Endpoints**: Dedicated endpoints for pickup, redemption, and earned histories

## 🏗️ System Architecture

### 🌐 High-Level Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer (Port: 5173-5178)"]
        UI[React UI Components]
        Router[React Router]
        Context[Auth & Points Context]
        Services[API Services]
    end
    
    subgraph Backend["Backend API Layer (Port: 5000-5001)"]
        Express[Express Server]
        Auth[JWT Auth Middleware]
        Routes[REST API Routes]
        MLSvc[ML Service Client]
        PointsCalc[Points Calculator]
    end
    
    subgraph ML["ML Service Layer (Port: 8000)"]
        FastAPI[FastAPI Server]
        Model[Random Forest Model]
        Dataset[Dataset Predictor]
        Fallback[Fallback Calculator]
    end
    
    subgraph Database["Database Layer (Port: 27017)"]
        MongoDB[(MongoDB)]
        UserCol[Users Collection]
        EWasteCol[E-Waste Submissions]
        RedemptCol[Redemptions]
    end
    
    UI --> Router
    Router --> Context
    Context --> Services
    Services -->|HTTP/REST| Express
    
    Express --> Auth
    Auth --> Routes
    Routes --> MLSvc
    Routes --> MongoDB
    
    MLSvc -->|HTTP POST /predict| FastAPI
    FastAPI --> Model
    Model --> Dataset
    Dataset -.Fallback.-> Fallback
    
    Routes --> UserCol
    Routes --> EWasteCol
    Routes --> RedemptCol
    
    MongoDB -.Session Store.-> Express
    
    style Client fill:#e3f2fd
    style Backend fill:#fff3e0
    style ML fill:#f3e5f5
    style Database fill:#e8f5e9
```

### 🔄 Component Interaction Diagram

```mermaid
graph LR
    subgraph Frontend Components
        A[App.jsx]
        B[Dashboard]
        C[SubmitEWaste]
        D[RedeemPoints]
        E[TransactionHistory]
        F[Profile]
    end
    
    subgraph Context Layer
        G[AuthContext]
        H[PointsContext]
    end
    
    subgraph Service Layer
        I[authService]
        J[pointsService]
        K[sessionService]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    
    B --> G
    B --> H
    C --> G
    C --> H
    D --> G
    E --> G
    F --> G
    
    G --> I
    H --> J
    I --> K
    
    style A fill:#4fc3f7
    style B fill:#81c784
    style C fill:#81c784
    style D fill:#81c784
    style E fill:#81c784
    style F fill:#81c784
    style G fill:#ffb74d
    style H fill:#ffb74d
    style I fill:#ba68c8
    style J fill:#ba68c8
    style K fill:#ba68c8
```

### 📊 Microservices Overview
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

### 🔄 Sequence Diagrams

#### E-Waste Submission Flow (AI-Powered)

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant Auth as AuthContext
    participant API as Express API
    participant MLSvc as ML Service
    participant ML as ML Model
    participant DB as MongoDB
    
    User->>UI: Submit E-Waste Form
    UI->>Auth: Check Authentication
    Auth->>UI: Valid Session
    UI->>API: POST /api/points/submit
    
    API->>API: Validate Input
    API->>MLSvc: predictPoints(itemData)
    MLSvc->>MLSvc: prepareRequestData()
    MLSvc->>ML: POST /predict
    
    alt ML Service Available
        ML->>ML: Load Model
        ML->>ML: Predict Price & Points
        ML-->>MLSvc: {price, points, confidence}
        MLSvc-->>API: ML Prediction
    else ML Service Down
        MLSvc->>MLSvc: fallbackCalculation()
        MLSvc-->>API: Fallback Result
    end
    
    API->>DB: Save EWasteSubmission
    API->>DB: Update User Points
    DB-->>API: Success
    API-->>UI: {points, price, breakdown}
    UI->>UI: Update Dashboard
    UI-->>User: Success + Points Earned
```

#### User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Login Page
    participant Auth as AuthContext
    participant API as Express API
    participant Session as Session Store
    participant DB as MongoDB
    
    User->>UI: Enter Credentials
    UI->>API: POST /api/auth/login
    API->>DB: Find User by Email
    DB-->>API: User Document
    API->>API: bcrypt.compare(password)
    
    alt Valid Credentials
        API->>Session: Create Session
        Session-->>API: Session ID
        API->>DB: Update lastLogin
        API-->>UI: {success, user, session}
        UI->>Auth: setUser(userData)
        Auth->>Auth: Store in Context
        UI->>UI: Redirect to Dashboard
        UI-->>User: Login Success
    else Invalid Credentials
        API-->>UI: {error: "Invalid credentials"}
        UI-->>User: Show Error
    end
```

#### Points Redemption Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as RedeemPoints Page
    participant API as Express API
    participant UserModel as User Model
    participant DB as MongoDB
    
    User->>UI: Select Reward Item
    UI->>API: GET /api/points/balance
    API->>DB: Get User Balance
    DB-->>API: {balance: 500}
    API-->>UI: Current Balance
    
    User->>UI: Confirm Redemption
    UI->>API: POST /api/points/redeem
    API->>UserModel: Check Balance
    
    alt Sufficient Balance
        UserModel->>UserModel: redeemPoints()
        UserModel->>UserModel: Update greenWallet
        UserModel->>DB: Save User
        API->>DB: Create RedemptionRequest
        DB-->>API: Success
        API-->>UI: {success, newBalance}
        UI-->>User: Redemption Successful
    else Insufficient Balance
        API-->>UI: {error: "Insufficient points"}
        UI-->>User: Show Error Message
    end
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

### 🎯 Class Diagram (Backend Models)

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +Number greenPoints
        +GreenWallet greenWallet
        +String userFrequency
        +Object profile
        +Array~String~ badges
        +String referralCode
        +String referredBy
        +Number totalItemsRecycled
        +Number totalWeightRecycled
        +Date createdAt
        +Date updatedAt
        +comparePassword(password) Boolean
        +addPoints(points, source, metadata) void
        +redeemPoints(points, source) void
        +updateUserFrequency() void
        +updateBadges() Array
        +canUse2XValue() Boolean
        +get2XTimeRemaining() Number
        +generateReferralCode() String
    }
    
    class GreenWallet {
        +Number balance
        +Number totalEarned
        +Number totalRedeemed
        +Array~Transaction~ history
    }
    
    class Transaction {
        +Date timestamp
        +Number points
        +String source
        +String type
        +Object metadata
    }
    
    class EWasteSubmission {
        +ObjectId _id
        +ObjectId userId
        +String deviceType
        +String brand
        +String model
        +String condition
        +Number weight
        +Number estimatedPrice
        +Number pointsEarned
        +String status
        +Date createdAt
    }
    
    class RedemptionRequest {
        +ObjectId _id
        +ObjectId userId
        +String itemName
        +Number pointsCost
        +String status
        +Date createdAt
        +Date updatedAt
    }
    
    class MLService {
        -String mlApiUrl
        -Number timeout
        -Number retryAttempts
        -Boolean fallbackEnabled
        +predictPoints(itemData) Object
        +validatePreparedData(data) void
        +prepareRequestData(itemData) Object
        +mapProductType(type) String
        +mapCondition(condition) String
        +calculateAge(ageInput) Number
        +makeRequestWithRetry(data) Object
        +processMLResponse(response, data) Object
        +fallbackCalculation(itemData) Object
        +basicFallback(itemData) Object
        +checkHealth() Object
        +getModelInfo() Object
        +setFallbackEnabled(enabled) void
    }
    
    User "1" *-- "1" GreenWallet : contains
    GreenWallet "1" *-- "*" Transaction : contains
    User "1" --o "*" EWasteSubmission : submits
    User "1" --o "*" RedemptionRequest : makes
    MLService ..> EWasteSubmission : predicts points for
```

### 🚀 Deployment Architecture Diagram

```mermaid
graph TB
    subgraph Production["Production Environment"]
        subgraph CDN["Vercel CDN"]
            FrontendDeploy[React App<br/>Deployed Build]
        end
        
        subgraph Backend["Railway/Render"]
            NodeServer[Node.js Server<br/>Port: 5000]
            SessionStore[Session Store<br/>MongoDB]
        end
        
        subgraph ML["Railway/Google Cloud"]
            MLServer[FastAPI Server<br/>Port: 8000]
            MLModel[Random Forest Model<br/>58MB]
        end
        
        subgraph Database["MongoDB Atlas"]
            MongoDB[(MongoDB Cluster<br/>M0 Free Tier)]
        end
    end
    
    subgraph Development["Local Development"]
        LocalFront[React Dev Server<br/>Port: 5173-5178]
        LocalBack[Express Server<br/>Port: 5000-5001]
        LocalML[FastAPI Server<br/>Port: 8000]
        LocalDB[(Local MongoDB<br/>Port: 27017)]
    end
    
    Users[End Users] -->|HTTPS| FrontendDeploy
    FrontendDeploy -->|REST API| NodeServer
    NodeServer -->|Predict| MLServer
    MLServer --> MLModel
    NodeServer --> MongoDB
    NodeServer --> SessionStore
    SessionStore --> MongoDB
    
    Dev[Developers] --> LocalFront
    LocalFront --> LocalBack
    LocalBack --> LocalML
    LocalBack --> LocalDB
    
    style FrontendDeploy fill:#4fc3f7
    style NodeServer fill:#ffb74d
    style MLServer fill:#ba68c8
    style MongoDB fill:#66bb6a
    style LocalFront fill:#81d4fa
    style LocalBack fill:#ffcc80
    style LocalML fill:#ce93d8
    style LocalDB fill:#a5d6a7
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

### 📊 Data Flow Diagram

```mermaid
graph LR
    subgraph Input["User Input"]
        A[Device Type]
        B[Brand]
        C[Condition]
        D[Weight]
        E[Age]
    end
    
    subgraph Processing["Data Processing"]
        F[Input Validation]
        G[Data Mapping]
        H[Feature Engineering]
    end
    
    subgraph AI["AI Prediction"]
        I[ML Model]
        J[Dataset Lookup]
        K[Fallback Calculator]
    end
    
    subgraph Output["Results"]
        L[Estimated Price]
        M[Green Points]
        N[Confidence Score]
        O[Breakdown]
    end
    
    subgraph Storage["Data Storage"]
        P[(MongoDB)]
        Q[User Points Update]
        R[Transaction History]
    end
    
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    
    F --> G
    G --> H
    
    H --> I
    I -->|Success| L
    I -->|Fail| J
    J -->|Success| L
    J -->|Fail| K
    K --> L
    
    L --> M
    L --> N
    L --> O
    
    M --> P
    M --> Q
    Q --> R
    
    style Input fill:#e3f2fd
    style Processing fill:#fff3e0
    style AI fill:#f3e5f5
    style Output fill:#e8f5e9
    style Storage fill:#fce4ec
```

### 🔄 E-Waste Submission State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: User Opens App
    Idle --> FormFilling: Click Submit E-Waste
    FormFilling --> Validating: Submit Form
    
    Validating --> MLPrediction: Valid Input
    Validating --> FormFilling: Invalid Input (Show Error)
    
    MLPrediction --> ProcessingML: Call ML Service
    ProcessingML --> MLSuccess: ML Response OK
    ProcessingML --> Fallback: ML Service Down
    
    MLSuccess --> SavingData: Store Submission
    Fallback --> SavingData: Use Fallback Points
    
    SavingData --> UpdatingPoints: Save to DB
    UpdatingPoints --> Success: Update User Points
    
    Success --> Dashboard: Redirect to Dashboard
    Dashboard --> [*]: Transaction Complete
    
    note right of MLPrediction
        Timeout: 1000ms
        Retry: 1 attempt
    end note
    
    note right of Fallback
        Uses hardcoded rules
        Lower confidence score
    end note
```

### 🔐 User Authentication State Diagram

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated: App Start
    Unauthenticated --> Login: Navigate to Login
    Unauthenticated --> Register: Navigate to Register
    
    Login --> Authenticating: Submit Credentials
    Register --> Creating: Submit Registration
    
    Authenticating --> Authenticated: Valid Credentials
    Authenticating --> Login: Invalid Credentials
    
    Creating --> Authenticated: Account Created
    Creating --> Register: Validation Failed
    
    Authenticated --> Active: Session Created
    Active --> Dashboard: Access Protected Routes
    Active --> Profile: Edit Profile
    Active --> Submit: Submit E-Waste
    Active --> Redeem: Redeem Points
    
    Active --> Logout: User Logout
    Logout --> Unauthenticated: Session Destroyed
    
    Active --> SessionExpired: 7 Days Timeout
    SessionExpired --> Unauthenticated: Clear Session
    
    note right of Active
        Session stored in MongoDB
        Cookie: httpOnly, 7 days
    end note
```

## 🤖 AI-Powered Pricing System

The system now uses machine learning for intelligent e-waste pricing and green points calculation:

### 🧠 ML Model Architecture

```mermaid
graph TB
    subgraph Input["Input Features (12 dimensions)"]
        F1[Device Type Encoded]
        F2[Brand Tier]
        F3[Condition Encoded]
        F4[Age Years]
        F5[Weight kg]
        F6[Storage GB]
        F7[Screen Size]
        F8[Location Tier]
        F9[Additional Features...]
    end
    
    subgraph Model["Random Forest Model"]
        Tree1[Decision Tree 1]
        Tree2[Decision Tree 2]
        Tree3[Decision Tree 3]
        TreeN[Decision Tree N<br/>100 trees total]
        
        Ensemble[Ensemble Aggregation<br/>Mean of all trees]
    end
    
    subgraph Output["Predictions"]
        Price[Estimated Price ₹]
        Points[Green Points]
        Confidence[Confidence Score<br/>0.6-0.95]
        Breakdown[Detailed Breakdown]
    end
    
    subgraph Fallback["Fallback System"]
        Dataset[Dataset Lookup<br/>Similarity Matching]
        Hardcoded[Hardcoded Rules<br/>Base + Multipliers]
        Basic[Basic Calculator<br/>Simple Formula]
    end
    
    F1 --> Tree1
    F2 --> Tree1
    F3 --> Tree1
    F4 --> Tree1
    F5 --> Tree1
    
    F1 --> Tree2
    F2 --> Tree2
    F3 --> Tree2
    
    F1 --> Tree3
    F4 --> Tree3
    F5 --> Tree3
    
    F1 --> TreeN
    F6 --> TreeN
    F7 --> TreeN
    
    Tree1 --> Ensemble
    Tree2 --> Ensemble
    Tree3 --> Ensemble
    TreeN --> Ensemble
    
    Ensemble --> Price
    Price --> Points
    Ensemble --> Confidence
    Price --> Breakdown
    
    Ensemble -.ML Fails.-> Dataset
    Dataset -.Dataset Fails.-> Hardcoded
    Hardcoded -.All Fail.-> Basic
    
    Basic --> Price
    Dataset --> Price
    Hardcoded --> Price
    
    style Input fill:#e3f2fd
    style Model fill:#f3e5f5
    style Output fill:#e8f5e9
    style Fallback fill:#fff3e0
```

### ML Model Features
- **Random Forest Regression**: Predicts both resale price and green points
- **Multi-factor Analysis**: Considers product type, brand, condition, age, weight
- **Confidence Scoring**: Each prediction includes confidence level (0.0-1.0)
- **Fallback System**: Graceful degradation to hardcoded rules when ML unavailable
- **Real-time Training**: Model can be retrained with new data
- **100 Decision Trees**: Ensemble learning for robust predictions
- **Dataset-based Fallback**: Similarity matching with training data
- **Three-tier Fallback**: ML → Dataset → Hardcoded → Basic

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

### 🗺️ API Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Applications"]
        WebApp[React Web App]
        Mobile[Future Mobile App]
    end
    
    subgraph Gateway["API Gateway Layer"]
        Express[Express.js Server]
        CORS[CORS Middleware]
        RateLimit[Rate Limiter]
        Session[Session Management]
    end
    
    subgraph Routes["Route Handlers"]
        AuthRoutes[/api/auth/*]
        PointsRoutes[/api/points/*]
        UserRoutes[/api/user/*]
        CoreRoutes[/api/*]
    end
    
    subgraph Services["Business Logic"]
        AuthService[Authentication Service]
        MLServiceClient[ML Service Client]
        PointsCalc[Points Calculator]
    end
    
    subgraph External["External Services"]
        MLBackend[ML API<br/>FastAPI]
        MongoDB[(MongoDB<br/>Database)]
    end
    
    WebApp --> Express
    Mobile -.Future.-> Express
    
    Express --> CORS
    CORS --> RateLimit
    RateLimit --> Session
    
    Session --> AuthRoutes
    Session --> PointsRoutes
    Session --> UserRoutes
    Session --> CoreRoutes
    
    AuthRoutes --> AuthService
    PointsRoutes --> MLServiceClient
    PointsRoutes --> PointsCalc
    UserRoutes --> AuthService
    
    MLServiceClient -->|HTTP| MLBackend
    AuthService --> MongoDB
    PointsCalc --> MongoDB
    
    style WebApp fill:#4fc3f7
    style Express fill:#ffb74d
    style AuthRoutes fill:#81c784
    style PointsRoutes fill:#81c784
    style UserRoutes fill:#81c784
    style MLBackend fill:#ba68c8
    style MongoDB fill:#66bb6a
```

### 📡 REST API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

#### Green Points (AI-Powered)
- `POST /api/points/submit` - Submit e-waste and earn points (ML-enhanced)
- `POST /api/points/redeem` - Redeem points for rewards
- `GET /api/points/balance` - Get user's points balance
- `GET /api/points/history` - Get transaction history
- `POST /api/points/calculate` - Calculate points preview (ML-enhanced)
- `GET /api/points/ml-status` - Check ML service health and model info
- `GET /api/points/pickup-history` - Get pickup history
- `GET /api/points/redemption-history` - Get redemption history
- `GET /api/points/earned-history` - Get earned points history
- `GET /api/points/badges` - Get user badges
- `GET /api/points/2x-status` - Get 2X value eligibility status

#### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/dashboard` - Get dashboard data
- `GET /api/user/stats` - Get user statistics

#### Core Routes
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `POST /api/ewaste/submit` - Submit e-waste (core)
- `GET /api/ewaste/submissions/:userId` - Get submissions
- `POST /api/ml/predict` - Direct ML prediction
- `POST /api/redemptions` - Create redemption request
- `GET /api/redemptions/:userId` - Get redemptions
- `GET /api/dashboard/:userId` - Get dashboard stats

## 🗄️ Database Schema

### 📐 Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ EWASTE_SUBMISSION : submits
    USER ||--o{ REDEMPTION_REQUEST : redeems
    USER ||--|| GREEN_WALLET : has
    GREEN_WALLET ||--|{ TRANSACTION : contains
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        int greenPoints
        GreenWallet greenWallet FK
        string userFrequency
        Object profile
        array badges
        string referralCode UK
        string referredBy
        int totalItemsRecycled
        float totalWeightRecycled
        date createdAt
        date updatedAt
    }
    
    GREEN_WALLET {
        int balance
        int totalEarned
        int totalRedeemed
        array history FK
    }
    
    TRANSACTION {
        date timestamp
        int points
        string source
        string type
        Object metadata
    }
    
    EWASTE_SUBMISSION {
        ObjectId _id PK
        ObjectId userId FK
        string deviceType
        string brand
        string model
        string condition
        float weight
        int estimatedPrice
        int pointsEarned
        string status
        date createdAt
    }
    
    REDEMPTION_REQUEST {
        ObjectId _id PK
        ObjectId userId FK
        string itemName
        int pointsCost
        string status
        date createdAt
        date updatedAt
    }
```

### 🗂️ User Document Structure
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
