import { getDevHost } from './resolveDevHost';

const host = getDevHost();

export const API_URL =
  process.env.EXPO_PUBLIC_BILLING_API_URL || `http://${host}:3005/api`;
