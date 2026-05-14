/** @type {import('expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'school-van-management-complete',
    slug: 'school-van-management-complete',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'svms-complete',
    userInterfaceStyle: 'light',
    android: {
      usesCleartextTraffic: true,
    },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsLocalNetworking: true,
        },
      },
    },
  },
};
