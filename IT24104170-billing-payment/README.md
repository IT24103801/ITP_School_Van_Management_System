# Billing & Payment Management Module
**Student ID**: IT24104170  
**Name**: Priyankara K.P.C

## Features
- Automated Fee Calculation based on attendance
- Billing Record Management
- Payment Monitoring
- Invoice Email Notifications (no payment gateway)

## Setup
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npx expo start
```

## API Endpoints
- POST /api/billing - Generate bill
- GET /api/billing/:studentId - Get student bills
- PUT /api/payments/:billId - Update payment status
- POST /api/billing/send-invoice - Send invoice email

## Port: 3005
