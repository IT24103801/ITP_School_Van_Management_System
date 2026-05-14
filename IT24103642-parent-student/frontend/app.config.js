/** @type {import('expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'parent-student-frontend',
    slug: 'parent-student-frontend',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'svms-parent-student',
    android: { usesCleartextTraffic: true },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      },
    },
  },
};
