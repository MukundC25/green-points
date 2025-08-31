#!/usr/bin/env bash
set -euo pipefail

# One-go setup and start for Green Points System
# Requirements: Node 18+, Python 3.10/3.11, MongoDB running locally

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# 1) Install deps if needed
if [ -f client/package.json ]; then
  echo "[setup] Installing client deps..."
  (cd client && npm install)
fi
if [ -f server/package.json ]; then
  echo "[setup] Installing server deps..."
  (cd server && npm install)
fi
if [ -f ml_service/requirements.txt ]; then
  echo "[setup] Installing ML service deps (in venv)..."
  python3 -m venv ml_service/venv || true
  source ml_service/venv/bin/activate
  pip install --upgrade pip
  pip install -r ml_service/requirements.txt
  deactivate || true
fi

mkdir -p logs

# 2) Start ML service (8000)
echo "[start] ML service on 8000"
source ml_service/venv/bin/activate
nohup python ml_service/main.py > logs/ml.out 2>&1 &
ML_PID=$!
deactivate || true

# 3) Start backend (5001)
echo "[start] Backend on 5001"
(cd server && PORT=5001 NODE_ENV=development CLIENT_URL=http://localhost:5173 ML_API_URL=http://127.0.0.1:8000 MONGODB_URI=mongodb://127.0.0.1:27017/green-points nohup node index.js > ../logs/backend.out 2>&1 &)
BACKEND_PID=$!

# 4) Start frontend (5173)
echo "[start] Frontend on 5173"
(cd client && VITE_API_URL=http://127.0.0.1:5001/api nohup npm run dev -- --host --port 5173 > ../logs/frontend.out 2>&1 &)
FRONTEND_PID=$!

sleep 5

# 5) Health checks
printf '[health] ML:      '; curl -4 -sS http://127.0.0.1:8000/health || true; echo
printf '[health] Backend: '; curl -4 -sS http://127.0.0.1:5001/api/health || true; echo
printf '[health] Proxy:   '; curl -4 -sS http://127.0.0.1:5173/api/health || true; echo
printf '[health] FE:      '; curl -sS http://localhost:5173/ | head -n 1 || true; echo

# 6) Show PIDs and logs
cat <<INFO
PIDs:
  ML:      $ML_PID
  Backend: $BACKEND_PID
  Frontend:$FRONTEND_PID
Logs:
  logs/ml.out
  logs/backend.out
  logs/frontend.out
Open:
  http://localhost:5173
INFO

