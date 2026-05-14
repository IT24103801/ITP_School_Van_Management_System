/** @type {import('expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'attendance-notifications-frontend',
    slug: 'attendance-notifications-frontend',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'svms-attendance',
    android: { usesCleartextTraffic: true },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      },
    },
  },
};
