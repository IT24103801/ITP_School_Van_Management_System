import { getDevHost } from './resolveDevHost';

const host = getDevHost();

export const API_URL =
  process.env.EXPO_PUBLIC_EMERGENCY_API_URL || `http://${host}:3002/api`;

export const SOCKET_URL =
  process.env.EXPO_PUBLIC_EMERGENCY_SOCKET_URL || `http://${host}:3002`;
