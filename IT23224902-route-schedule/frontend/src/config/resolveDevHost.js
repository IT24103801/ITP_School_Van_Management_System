import Constants from 'expo-constants';
import { Platform } from 'react-native';

function hostnameFromCandidate(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.includes('://')) {
    try {
      const withScheme = trimmed.startsWith('exp:')
        ? trimmed.replace(/^exp:/, 'http:')
        : trimmed;
      const url = new URL(withScheme);
      const h = url.hostname;
      if (h && h !== 'localhost' && h !== '127.0.0.1') return h;
      return null;
    } catch {
      const afterScheme = trimmed.split('://')[1] || trimmed;
      const host = afterScheme.split(':')[0]?.split('/')[0]?.trim();
      if (host && host !== 'localhost' && host !== '127.0.0.1') return host;
      return null;
    }
  }

  const host = trimmed.split(':')[0]?.trim();
  if (host && host !== 'localhost' && host !== '127.0.0.1') return host;
  return null;
}

function expoLanHost() {
  const c = Constants;

  const dbgSources = [
    c.expoGoConfig?.debuggerHost,
    c.manifest?.debuggerHost,
    c.manifest2?.debuggerHost,
    c.manifest2?.extra?.expoGo?.debuggerHost,
  ];

  for (const raw of dbgSources) {
    const h = hostnameFromCandidate(raw);
    if (h) return h;
  }

  const hostUri =
    c.expoConfig?.hostUri ||
    c.manifest2?.extra?.expoClient?.hostUri ||
    c.manifest?.hostUri;

  const fromUri = hostnameFromCandidate(typeof hostUri === 'string' ? hostUri : '');
  if (fromUri) return fromUri;

  return null;
}

export function getDevHost() {
  const env = process.env.EXPO_PUBLIC_API_HOST;
  if (env && typeof env === 'string' && env.trim()) {
    return env.trim();
  }

  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' && window.location?.hostname
      ? window.location.hostname
      : 'localhost';
  }

  const lan = expoLanHost();
  if (lan) return lan;

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
}
