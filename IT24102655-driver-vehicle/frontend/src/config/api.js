import { getDevHost } from './resolveDevHost';

const host = getDevHost();

export const API_URL =
  process.env.EXPO_PUBLIC_DRIVER_VEHICLE_API_URL || `http://${host}:3006/api`;
