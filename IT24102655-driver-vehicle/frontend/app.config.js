/** @type {import('expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'driver-vehicle-frontend',
    slug: 'driver-vehicle-frontend',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'svms-driver-vehicle',
    android: { usesCleartextTraffic: true },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      },
    },
  },
};
