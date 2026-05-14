// Shared TypeScript types across all modules

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  grade: string;
  assignedVanId: string;
  assignedRouteId: string;
  stopPointId: string;
  emergencyContacts: EmergencyContact[];
  parentIds: string[];
}

export interface Parent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedStudents: string[];
}

export interface Route {
  _id: string;
  routeId: string;
  routeName: string;
  vanId: string;
  stopPoints: StopPoint[];
  isActive: boolean;
  currentGPS?: GPSCoordinate;
}

export interface StopPoint {
  _id: string;
  stopId: string;
  name: string;
  location: GPSCoordinate;
  sequence: number;
  estimatedTime: string;
  assignedStudents: string[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface NotificationPayload {
  type: 'emergency' | 'attendance' | 'delay' | 'billing' | 'general';
  title: string;
  message: string;
  recipientIds: string[];
  priority: 'high' | 'medium' | 'low';
  metadata?: any;
}

export enum UserRole {
  ADMIN = 'admin',
  DRIVER = 'driver',
  PARENT = 'parent',
  ATTENDANT = 'attendant'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
