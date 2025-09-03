import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5178;

// Serve static files from client directory
app.use(express.static(path.join(__dirname)));

// Simple API proxy (manual)
app.use('/api/*', (req, res) => {
  res.json({ message: 'API proxy not implemented yet - use direct backend calls' });
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on http://localhost:${PORT}`);
  console.log(`📱 Open: http://localhost:${PORT}`);
});
