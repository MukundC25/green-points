# Deployment Guide

## Vercel Deployment Status

### Frontend Deployment ✅
- **Platform**: Vercel
- **Framework**: Vite + React
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables Required
```
VITE_API_URL=http://localhost:5001/api
```

### Deployment Steps Completed
1. ✅ Updated API calls to use environment variables
2. ✅ Created vercel.json configuration
3. ✅ Set up proper routing for SPA
4. ✅ Ready for Vercel import

### Next Steps (Vercel Website Deployment)
1. Go to [vercel.com](https://vercel.com) and login with GitHub
2. Click "New Project" or "Add New..."
3. Import your GitHub repository: `green-points`
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add environment variables:
   - `VITE_API_URL`: `http://localhost:5001/api` (for now)
   - `VITE_NODE_ENV`: `production`
6. Click "Deploy"!

### Backend Options
- **Option 1**: Keep local (development)
- **Option 2**: Deploy to Railway/Render
- **Option 3**: Demo mode (frontend only)

### Expected URLs
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: Local or deployed service
- **ML Service**: Local or deployed service

### Testing
After deployment, test:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ UI components render
- ⚠️ API calls (depends on backend setup)
