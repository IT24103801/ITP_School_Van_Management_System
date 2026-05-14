# Driver and Vehicle Management Module
**Student ID**: IT24102655  
**Name**: Minsara P.G.S

## Features
- Driver Behavior Analysis
- Vehicle Profile Management
- Route Adherence Monitoring
- Trip History Logs

## Setup
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npx expo start
```

## API Endpoints
- POST /api/drivers - Register driver
- GET /api/drivers - Get all drivers
- POST /api/vehicles - Register vehicle
- GET /api/behavior/:driverId - Get driver behavior
- GET /api/trips - Get trip history

## Port: 3006
