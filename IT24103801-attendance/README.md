# Student Attendance & Notifications Module
**Student ID**: IT24103801  
**Name**: Siriwardana B. H. R. Y

## Features
- Digital Attendance Logs (Picked Up/Dropped Safely)
- Real-time Notifications to parents
- Automated Daily Reports
- Delay Alerts

## Setup
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npx expo start
```

## API Endpoints
- POST /api/attendance - Mark attendance
- GET /api/attendance - Get attendance logs
- POST /api/notifications - Send notification
- GET /api/notifications/:parentId - Get parent notifications

## Port: 3003
