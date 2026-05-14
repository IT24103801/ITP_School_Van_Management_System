-- School Van Management System - Complete MySQL Database Schema
-- All 6 Modules

CREATE DATABASE IF NOT EXISTS school_van_system;
USE school_van_system;

-- ============================================================================
-- MODULE 1: ROUTE & SCHEDULE MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  routeId VARCHAR(50) NOT NULL UNIQUE,
  routeName VARCHAR(255) NOT NULL,
  vanId VARCHAR(50) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  currentGPS_latitude DECIMAL(10, 8),
  currentGPS_longitude DECIMAL(11, 8),
  currentGPS_timestamp DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vanId (vanId),
  INDEX idx_active (isActive)
);

CREATE TABLE IF NOT EXISTS stop_points (
  id INT PRIMARY KEY AUTO_INCREMENT,
  stopId VARCHAR(50) NOT NULL UNIQUE,
  routeId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  sequence INT NOT NULL,
  estimatedTime VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (routeId) REFERENCES routes(id) ON DELETE CASCADE,
  INDEX idx_routeId (routeId)
);

CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  routeId INT NOT NULL,
  vanId VARCHAR(50) NOT NULL,
  session ENUM('morning', 'afternoon') NOT NULL,
  departureTime VARCHAR(10) NOT NULL,
  arrivalTime VARCHAR(10) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  specialNotes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (routeId) REFERENCES routes(id) ON DELETE CASCADE,
  INDEX idx_session (session)
);

-- ============================================================================
-- MODULE 2: EMERGENCY & SAFETY MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS sos_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alertId VARCHAR(50) NOT NULL UNIQUE,
  vanId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50) NOT NULL,
  routeId VARCHAR(50) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status ENUM('Reported', 'In Progress', 'Resolved') DEFAULT 'Reported',
  description TEXT,
  responseNotes TEXT,
  resolvedAt DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_vanId (vanId)
);

CREATE TABLE IF NOT EXISTS incidents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  incidentId VARCHAR(50) NOT NULL UNIQUE,
  vanId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50) NOT NULL,
  type ENUM('Breakdown', 'Accident', 'Safety Concern', 'Other') NOT NULL,
  severity ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  description TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status ENUM('Reported', 'Under Investigation', 'Resolved') DEFAULT 'Reported',
  resolutionDetails TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS broadcast_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  alertId VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('Emergency Stop', 'Route Change', 'Delay', 'General') NOT NULL,
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  targetAudience ENUM('All Parents', 'Specific Route', 'Specific Van') DEFAULT 'All Parents',
  routeId VARCHAR(50),
  vanId VARCHAR(50),
  sentAt DATETIME,
  createdBy VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS safety_checks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  checkId VARCHAR(50) NOT NULL UNIQUE,
  vanId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50) NOT NULL,
  brakes BOOLEAN DEFAULT FALSE,
  tires BOOLEAN DEFAULT FALSE,
  lights BOOLEAN DEFAULT FALSE,
  fuel BOOLEAN DEFAULT FALSE,
  firstAidKit BOOLEAN DEFAULT FALSE,
  fireExtinguisher BOOLEAN DEFAULT FALSE,
  overallStatus ENUM('Pass', 'Fail', 'Needs Attention') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MODULE 3: ATTENDANCE & NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId INT NOT NULL,
  routeId INT NOT NULL,
  stopPointId VARCHAR(50),
  date DATE NOT NULL,
  session ENUM('morning', 'afternoon') NOT NULL,
  status ENUM('Picked Up', 'Dropped Safely', 'Absent', 'Late') NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  markedBy VARCHAR(100),
  notes TEXT,
  INDEX idx_student (studentId),
  INDEX idx_date (date)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipientId INT NOT NULL,
  type ENUM('Attendance', 'Delay', 'Emergency', 'General') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  isRead BOOLEAN DEFAULT FALSE,
  sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata JSON,
  INDEX idx_recipient (recipientId),
  INDEX idx_read (isRead)
);

-- ============================================================================
-- MODULE 4: PARENT & STUDENT MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS parents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT,
  notificationEmail BOOLEAN DEFAULT TRUE,
  notificationSMS BOOLEAN DEFAULT TRUE,
  notificationPush BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId VARCHAR(50) NOT NULL UNIQUE,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  grade VARCHAR(20) NOT NULL,
  dateOfBirth DATE,
  assignedVanId VARCHAR(50),
  assignedRouteId INT,
  stopPointId VARCHAR(50),
  pickupAddress TEXT,
  pickupLatitude DECIMAL(10, 8),
  pickupLongitude DECIMAL(11, 8),
  dropAddress TEXT,
  dropLatitude DECIMAL(10, 8),
  dropLongitude DECIMAL(11, 8),
  isActive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_studentId (studentId),
  INDEX idx_vanId (assignedVanId)
);

CREATE TABLE IF NOT EXISTS parent_student_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parentId INT NOT NULL,
  studentId INT NOT NULL,
  relationship VARCHAR(50),
  isPrimary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parentId) REFERENCES parents(id) ON DELETE CASCADE,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_link (parentId, studentId)
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studentId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================================================
-- MODULE 5: BILLING & PAYMENT MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS billing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  billId VARCHAR(50) NOT NULL UNIQUE,
  studentId INT NOT NULL,
  parentId INT NOT NULL,
  month VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  baseFee DECIMAL(10, 2) NOT NULL,
  attendancePercentage DECIMAL(5, 2),
  calculatedFee DECIMAL(10, 2) NOT NULL,
  status ENUM('Pending', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Pending',
  dueDate DATE,
  paidDate DATE,
  invoiceSent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (parentId) REFERENCES parents(id),
  INDEX idx_status (status),
  INDEX idx_student (studentId)
);

-- ============================================================================
-- MODULE 6: DRIVER & VEHICLE MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS drivers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  driverId VARCHAR(50) NOT NULL UNIQUE,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  licenseNumber VARCHAR(50) NOT NULL UNIQUE,
  licenseExpiry DATE,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  assignedVanId VARCHAR(50),
  status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  performanceScore INT DEFAULT 100,
  violationCount INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_driverId (driverId),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vanId VARCHAR(50) NOT NULL UNIQUE,
  registrationNumber VARCHAR(50) NOT NULL UNIQUE,
  model VARCHAR(100),
  capacity INT,
  insuranceExpiry DATE,
  lastServiceDate DATE,
  nextServiceDate DATE,
  assignedDriverId VARCHAR(50),
  status ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_vanId (vanId),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS driver_behavior (
  id INT PRIMARY KEY AUTO_INCREMENT,
  driverId VARCHAR(50) NOT NULL,
  vanId VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  speedViolations INT DEFAULT 0,
  harshBraking INT DEFAULT 0,
  routeDeviations INT DEFAULT 0,
  score INT DEFAULT 100,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_driver (driverId),
  INDEX idx_date (date)
);

CREATE TABLE IF NOT EXISTS trips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tripId VARCHAR(50) NOT NULL UNIQUE,
  routeId INT NOT NULL,
  vanId VARCHAR(50) NOT NULL,
  driverId VARCHAR(50) NOT NULL,
  session ENUM('morning', 'afternoon') NOT NULL,
  startTime DATETIME,
  endTime DATETIME,
  status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  fuelUsed DECIMAL(5, 2),
  distanceCovered DECIMAL(6, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_route (routeId),
  INDEX idx_date (startTime)
);
