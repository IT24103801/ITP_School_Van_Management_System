/**
 * Optional: EXPO_PUBLIC_ATTENDANCE_API_URL=http://HOST:3003/api
 * Or set EXPO_PUBLIC_API_HOST for all services on this machine.
 */
import { getDevHost } from './resolveDevHost';

const host = getDevHost();
const PORT = 3003;

export const ATTENDANCE_API_URL =
  process.env.EXPO_PUBLIC_ATTENDANCE_API_URL || `http://${host}:${PORT}/api`;
