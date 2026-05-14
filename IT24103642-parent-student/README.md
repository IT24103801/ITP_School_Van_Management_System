# Parent and Student Management Module
**Student ID**: IT24103642  
**Name**: De Silva P.H.V.B

## Features
- Student Profile Management
- Parent Portal Access
- Multi-Guardian Linking
- Secure Login System

## Setup
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npx expo start
```

## API Endpoints
- POST /api/auth/register - Register parent
- POST /api/auth/login - Parent login
- POST /api/students - Create student profile
- GET /api/students - Get all students
- POST /api/parents/:parentId/link/:studentId - Link guardian

## Port: 3004
