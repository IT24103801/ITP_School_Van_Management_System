/** @type {import('expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'billing-payment-frontend',
    slug: 'billing-payment-frontend',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'svms-billing',
    android: { usesCleartextTraffic: true },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsLocalNetworking: true },
      },
    },
  },
};
