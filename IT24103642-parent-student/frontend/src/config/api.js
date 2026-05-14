import { getDevHost } from './resolveDevHost';

const host = getDevHost();

export const API_URL =
  process.env.EXPO_PUBLIC_PARENT_STUDENT_API_URL || `http://${host}:3004/api`;
