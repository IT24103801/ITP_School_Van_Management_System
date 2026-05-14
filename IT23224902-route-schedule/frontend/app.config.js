/** @type {import('expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'route-schedule-frontend',
    slug: 'route-schedule-frontend',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'svms-route',
    android: { usesCleartextTraffic: true },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      },
    },
  },
};
