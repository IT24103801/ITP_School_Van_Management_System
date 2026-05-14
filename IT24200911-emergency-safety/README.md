# Emergency & Safety Management Module
**Student ID**: IT24200911  
**Name**: Laksahan L.C

## Features
- SOS/Panic Button with real-time alerts
- Incident Reporting (breakdowns, accidents)
- Broadcast Alerts to parents
- Safety Check Logs for drivers

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npx expo start
```

## API Endpoints

### SOS Alerts
- `POST /api/sos` - Create SOS alert
- `GET /api/sos` - Get all SOS alerts
- `GET /api/sos/:id` - Get SOS alert by ID
- `PUT /api/sos/:id` - Update SOS alert status
- `DELETE /api/sos/:id` - Delete SOS alert

### Incidents
- `POST /api/incidents` - Create incident
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get incident by ID
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Broadcast Alerts
- `POST /api/broadcasts` - Send broadcast
- `GET /api/broadcasts` - Get all broadcasts
- `GET /api/broadcasts/:id` - Get broadcast by ID
- `PUT /api/broadcasts/:id` - Update broadcast
- `DELETE /api/broadcasts/:id` - Delete broadcast

### Safety Checks
- `POST /api/safety-checks` - Create safety check
- `GET /api/safety-checks` - Get all safety checks
- `GET /api/safety-checks/:id` - Get safety check by ID
- `PUT /api/safety-checks/:id` - Update safety check
- `DELETE /api/safety-checks/:id` - Delete safety check

## Integration Points
- Receives GPS coordinates from Route & Schedule module
- Sends emergency notifications to Parent module
- Broadcasts alerts via Socket.io
