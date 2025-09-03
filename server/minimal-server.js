// Minimal backend server for Green Points System
const http = require('http');
const url = require('url');

const PORT = 5001;

// Simple CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Simple response helper
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, corsHeaders);
  res.end(JSON.stringify(data));
}

// Handle CORS preflight
function handleCORS(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return true;
  }
  return false;
}

// Simple request body parser
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (error) {
      callback(error, null);
    }
  });
}

// Create server
const server = http.createServer((req, res) => {
  // Handle CORS
  if (handleCORS(req, res)) return;

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // Health check
  if (path === '/api/health' && method === 'GET') {
    sendResponse(res, 200, { 
      status: 'healthy', 
      message: 'Green Points Backend is running',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Dashboard endpoint (simplified)
  if (path === '/api/user/dashboard-session' && method === 'GET') {
    sendResponse(res, 200, {
      user: { name: 'Demo User', email: 'demo@greenpoints.com' },
      totalPoints: 150,
      totalSubmissions: 5,
      totalValue: 250,
      badges: ['eco-warrior', 'recycling-champion'],
      recentTransactions: []
    });
    return;
  }

  // Submit e-waste endpoint
  if (path === '/api/ewaste/submit' && method === 'POST') {
    parseBody(req, (error, data) => {
      if (error) {
        sendResponse(res, 400, { error: 'Invalid JSON' });
        return;
      }

      // Simple points calculation
      const points = data.estimatedPoints || Math.floor((data.weight || 1) * 2);
      const price = data.estimatedPrice || points * 10;

      sendResponse(res, 200, {
        success: true,
        message: 'E-waste submitted successfully',
        totalPoints: points,
        totalEstimatedPrice: price,
        submissionId: Date.now().toString()
      });
    });
    return;
  }

  // User registration (simplified)
  if (path === '/api/auth/register' && method === 'POST') {
    parseBody(req, (error, data) => {
      if (error) {
        sendResponse(res, 400, { error: 'Invalid JSON' });
        return;
      }

      sendResponse(res, 201, {
        success: true,
        message: 'User registered successfully',
        user: { 
          name: data.name || 'Demo User', 
          email: data.email || 'demo@greenpoints.com' 
        },
        token: 'demo-token-' + Date.now()
      });
    });
    return;
  }

  // User login (simplified)
  if (path === '/api/auth/login' && method === 'POST') {
    parseBody(req, (error, data) => {
      if (error) {
        sendResponse(res, 400, { error: 'Invalid JSON' });
        return;
      }

      sendResponse(res, 200, {
        success: true,
        message: 'Login successful',
        user: { 
          name: 'Demo User', 
          email: data.email || 'demo@greenpoints.com' 
        },
        token: 'demo-token-' + Date.now()
      });
    });
    return;
  }

  // 404 for unknown routes
  sendResponse(res, 404, { error: 'Route not found' });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Green Points Backend running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/user/dashboard-session`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
