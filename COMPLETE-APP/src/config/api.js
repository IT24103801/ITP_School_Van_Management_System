import { getDevHost } from './resolveDevHost';

/**
 * Override host: EXPO_PUBLIC_API_HOST=192.168.x.x (physical device / firewall edge cases)
 * Per-service URL overrides still supported below.
 */
const host = getDevHost();

function serviceApi(port, envVar) {
  if (process.env[envVar]) return process.env[envVar];
  return `http://${host}:${port}/api`;
}

function serviceSocket(port, envVar) {
  if (process.env[envVar]) return process.env[envVar];
  return `http://${host}:${port}`;
}

export { getDevHost };

export const ROUTE_SCHEDULE_API_URL = serviceApi(3001, 'EXPO_PUBLIC_ROUTE_API_URL');
export const ROUTE_SCHEDULE_SOCKET_URL = serviceSocket(3001, 'EXPO_PUBLIC_ROUTE_SOCKET_URL');

export const EMERGENCY_API_URL = serviceApi(3002, 'EXPO_PUBLIC_EMERGENCY_API_URL');
export const EMERGENCY_SOCKET_URL = serviceSocket(3002, 'EXPO_PUBLIC_EMERGENCY_SOCKET_URL');

export const ATTENDANCE_API_URL = serviceApi(3003, 'EXPO_PUBLIC_ATTENDANCE_API_URL');

export const PARENT_STUDENT_API_URL = serviceApi(3004, 'EXPO_PUBLIC_PARENT_STUDENT_API_URL');

export const BILLING_API_URL = serviceApi(3005, 'EXPO_PUBLIC_BILLING_API_URL');

export const DRIVER_VEHICLE_API_URL = serviceApi(3006, 'EXPO_PUBLIC_DRIVER_VEHICLE_API_URL');
