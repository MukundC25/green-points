# 🚀 Green Points System - Production Deployment Guide

## 📋 Overview

This guide covers deploying the complete Green Points System to production with:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Railway/Render (Node.js/Express)
- **ML Service**: Railway (Python/FastAPI)
- **Database**: MongoDB Atlas

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

```bash
cd client

# Install dependencies
npm install

# Create production build
npm run build

# Test production build locally
npm run preview
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from client directory
cd client
vercel --prod
```

### Step 3: Configure Environment Variables on Vercel

In Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_NODE_ENV=production
```

### Step 4: Configure Build Settings

**vercel.json** (create in client/ directory):
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🖥️ Backend Deployment (Railway)

### Step 1: Prepare Backend

```bash
cd server

# Ensure package.json has correct scripts
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "npm install"
  }
}
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select `server` folder as root
4. Deploy automatically

### Step 3: Environment Variables on Railway

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greenpoints
JWT_SECRET=your-super-secure-production-jwt-secret
ML_SERVICE_URL=https://your-ml-service.railway.app
CORS_ORIGIN=https://your-frontend.vercel.app
```

## 🧠 ML Service Deployment (Railway)

### Step 1: Prepare ML Service

Create **railway.toml** in ml_service/:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"

[env]
PYTHONPATH = "/app"
```

### Step 2: Deploy ML Service

1. Create new Railway project
2. Connect GitHub repository  
3. Select `ml_service` folder as root
4. Deploy automatically

### Step 3: Environment Variables for ML Service

```
PORT=8000
HOST=0.0.0.0
MODEL_PATH=./models/ewaste_model.pkl
CORS_ORIGINS=["https://your-backend.railway.app", "https://your-frontend.vercel.app"]
LOG_LEVEL=INFO
```

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for production)

### Step 2: Get Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/greenpoints?retryWrites=true&w=majority
```

## 🔧 Production Optimizations

### Frontend Optimizations

**vite.config.js** updates:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-hot-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### Backend Optimizations

**Production middleware** in server/index.js:
```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet());
  app.set('trust proxy', 1);
}
```

### ML Service Optimizations

**Model caching** in main.py:
```python
# Cache model in memory
model = None

@app.on_event("startup")
async def load_model():
    global model
    model = joblib.load(MODEL_PATH)
```

## 🔍 Health Checks & Monitoring

### Backend Health Check
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### ML Service Health Check
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Production builds tested locally
- [ ] Database connection strings updated
- [ ] CORS origins configured correctly
- [ ] SSL certificates enabled

### Post-Deployment
- [ ] All services responding to health checks
- [ ] Frontend can communicate with backend
- [ ] Backend can communicate with ML service
- [ ] Database connections working
- [ ] ML predictions functioning
- [ ] Error handling working correctly

### Testing Production
```bash
# Test frontend
curl https://your-frontend.vercel.app

# Test backend health
curl https://your-backend.railway.app/health

# Test ML service
curl https://your-ml-service.railway.app/health

# Test full integration
curl -X POST https://your-ml-service.railway.app/predict \
  -H "Content-Type: application/json" \
  -d '{"product_type":"smartphone","brand":"Apple","condition":"good","age":2,"weight":0.2}'
```

## 🔒 Security Considerations

- Use strong JWT secrets in production
- Enable HTTPS for all services
- Configure proper CORS origins
- Use environment variables for all secrets
- Enable rate limiting on APIs
- Monitor for unusual activity

## 📊 Performance Monitoring

- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor response times and error rates
- Set up alerts for service failures
- Monitor database performance
- Track ML model accuracy over time

---

**🎉 Your Green Points System is now production-ready with AI-powered predictions!**
