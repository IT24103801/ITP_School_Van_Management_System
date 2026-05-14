import { getDevHost } from './resolveDevHost';

const host = getDevHost();
const PORT = 3001;

export const ROUTE_SCHEDULE_API_URL =
  process.env.EXPO_PUBLIC_ROUTE_API_URL || `http://${host}:${PORT}/api`;

export const ROUTE_SCHEDULE_SOCKET_URL =
  process.env.EXPO_PUBLIC_ROUTE_SOCKET_URL || `http://${host}:${PORT}`;
