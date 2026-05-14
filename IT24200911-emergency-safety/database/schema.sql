-- School Van Management System - Emergency & Safety Module
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS school_van_system;
USE school_van_system;

-- SOS Alerts Table
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
  INDEX idx_vanId (vanId),
  INDEX idx_created (created_at)
);

-- Incidents Table
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
  INDEX idx_status (status),
  INDEX idx_severity (severity),
  INDEX idx_vanId (vanId)
);

-- Broadcast Alerts Table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_priority (priority),
  INDEX idx_created (created_at)
);

-- Safety Checks Table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_vanId (vanId),
  INDEX idx_status (overallStatus),
  INDEX idx_created (created_at)
);
