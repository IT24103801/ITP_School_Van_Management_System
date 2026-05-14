# 🏗️ System Architecture

## Complete App Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MOBILE APP                              │
│                    (React Native + Expo)                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Main Menu Screen                        │ │
│  │              (6 Module Navigation Cards)                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐            │
│         │                    │                    │            │
│    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐       │
│    │ Module  │         │ Module  │         │ Module  │       │
│    │   1-2   │         │   3-4   │         │   5-6   │       │
│    │ Screens │         │ Screens │         │ Screens │       │
│    └────┬────┘         └────┬────┘         └────┬────┘       │
│         │                   │                   │            │
└─────────┼───────────────────┼───────────────────┼────────────┘
          │                   │                   │
          │    HTTP/REST      │                   │
          │    Socket.io      │                   │
          │                   │                   │
┌─────────▼───────────────────▼───────────────────▼────────────┐
│                    UNIFIED BACKEND                            │
│                  (unified-server.js)                          │
│                                                               │
│  Spawns and manages 6 independent backend processes:         │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Module 1 │  │ Module 2 │  │ Module 3 │  │ Module 4 │    │
│  │ Port     │  │ Port     │  │ Port     │  │ Port     │    │
│  │ 3001     │  │ 3002     │  │ 3003     │  │ 3004     │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │             │             │           │
│  ┌────▼─────┐  ┌────▼─────┐                                 │
│  │ Module 5 │  │ Module 6 │                                 │
│  │ Port     │  │ Port     │                                 │
│  │ 3005     │  │ 3006     │                                 │
│  └────┬─────┘  └────┬─────┘                                 │
│       │             │                                        │
└───────┼─────────────┼────────────────────────────────────────┘
        │             │
        │   MySQL     │
        │   Queries   │
        │             │
┌───────▼─────────────▼────────────────────────────────────────┐
│                    MySQL DATABASE                             │
│                 (school_van_system)                           │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Routes   │  │ SOS      │  │Attendance│  │ Parents  │    │
│  │ Schedules│  │ Incidents│  │Notificat.│  │ Students │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                               │
│  ┌──────────┐  ┌──────────┐                                 │
│  │ Billing  │  │ Drivers  │                                 │
│  │ Payments │  │ Vehicles │                                 │
│  └──────────┘  └──────────┘                                 │
│                                                               │
│  Total: 20+ tables with relationships                        │
└───────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Layer
- **Technology:** React Native with Expo SDK 54
- **Navigation:** React Navigation (Stack Navigator)
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Total Screens:** 28 screens across 6 modules

### Backend Layer
- **Technology:** Node.js + Express
- **Architecture:** Microservices (6 independent servers)
- **ORM:** Sequelize
- **Real-time:** Socket.io Server
- **Ports:** 3001-3006

### Database Layer
- **Technology:** MySQL
- **Interface:** phpMyAdmin
- **Database:** school_van_system
- **Tables:** 20+ tables with foreign key relationships

## Data Flow

### 1. User Interaction
```
User taps module → Navigation → Module screens → API call
```

### 2. API Request
```
Screen → Axios → HTTP Request → Backend (Port 300X) → MySQL
```

### 3. API Response
```
MySQL → Backend → JSON Response → Axios → Screen → UI Update
```

### 4. Real-time Updates (Emergency Module)
```
Event → Socket.io Server → Broadcast → Socket.io Client → UI Update
```

## Module Details

### Module 1: Route & Schedule (Port 3001)
**Tables:** routes, schedules, tracking_logs
**Features:** Route management, scheduling, live tracking

### Module 2: Emergency & Safety (Port 3002)
**Tables:** sos_alerts, incidents, broadcasts, safety_checks
**Features:** SOS alerts, incident reporting, safety monitoring

### Module 3: Attendance (Port 3003)
**Tables:** attendance, notifications
**Features:** Attendance tracking, automated notifications

### Module 4: Parent & Student (Port 3004)
**Tables:** parents, students
**Features:** Parent/student management, relationships

### Module 5: Billing & Payment (Port 3005)
**Tables:** billing, payments
**Features:** Bill generation, payment tracking, invoices

### Module 6: Driver & Vehicle (Port 3006)
**Tables:** drivers, vehicles
**Features:** Driver/vehicle management, assignments

## Network Configuration

### Development Setup
- **Computer IP:** 172.20.10.3
- **Backend Ports:** 3001-3006
- **Frontend:** Expo Dev Server (Port 8081)
- **Database:** localhost:3306

### Requirements
- Computer and phone on same WiFi network
- MySQL running on localhost
- Ports 3001-3006 available
- Expo Go app installed on phone

## Deployment Strategy

### Single Command Startup
```
🚀_START_COMPLETE_APP.bat
  ├── Start unified-server.js
  │   ├── Spawn Module 1 backend (3001)
  │   ├── Spawn Module 2 backend (3002)
  │   ├── Spawn Module 3 backend (3003)
  │   ├── Spawn Module 4 backend (3004)
  │   ├── Spawn Module 5 backend (3005)
  │   └── Spawn Module 6 backend (3006)
  └── Start Expo frontend
```

### Process Management
- All backend processes managed by unified-server.js
- Graceful shutdown on Ctrl+C
- Color-coded console output per module
- Automatic restart on crash (optional)

## Security Considerations

### Current Setup (Development)
- No authentication (for demo purposes)
- CORS enabled for all origins
- MySQL with no password (local development)

### Production Recommendations
- Add JWT authentication
- Implement role-based access control
- Use environment-specific CORS
- Secure MySQL with strong password
- Add HTTPS/SSL
- Implement rate limiting
- Add input validation and sanitization

## Scalability

### Current Architecture Benefits
- Microservices allow independent scaling
- Each module can be deployed separately
- Database can be sharded by module
- Load balancing possible per module

### Future Enhancements
- Docker containerization
- Kubernetes orchestration
- Redis for caching
- Message queue for async operations
- API Gateway for unified entry point
- Monitoring and logging (ELK stack)

## Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React Native | 0.81.5 |
| Frontend Framework | Expo | SDK 54 |
| Navigation | React Navigation | 6.x |
| HTTP Client | Axios | 1.6.0 |
| Real-time | Socket.io Client | 4.6.0 |
| Backend | Node.js + Express | Latest |
| ORM | Sequelize | Latest |
| Database | MySQL | 8.x |
| Real-time Server | Socket.io | 4.6.0 |

---

**Architecture designed for:**
- ✅ Easy development and testing
- ✅ Clear separation of concerns
- ✅ Independent module deployment
- ✅ Scalability and maintainability
- ✅ Team collaboration (6 members)
