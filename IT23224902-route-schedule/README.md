# Route & Schedule Management Module
**Student ID**: IT23224902  
**Name**: E. D. A. Silva

## Features
- Live GPS Tracking with real-time map visualization
- Route Mapping with stop point allocation
- Schedule Management for morning/afternoon sessions
- Socket.io for real-time GPS broadcasting

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npx expo start
```

## API Endpoints

### Routes
- `POST /api/routes` - Create route
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route
- `PUT /api/routes/:id/gps` - Update live GPS
- `GET /api/routes/active-gps` - Get active routes with GPS

### Schedules
- `POST /api/schedules` - Create schedule
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get schedule by ID
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

## Dependencies
- React Native (Expo SDK 54)
- React Native Maps
- Socket.io Client
- Node.js + Express
- MongoDB + Mongoose
- Socket.io Server
