/** @type {import('expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'emergency-safety-frontend',
    slug: 'emergency-safety-frontend',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'svms-emergency',
    android: { usesCleartextTraffic: true },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      },
    },
  },
};
