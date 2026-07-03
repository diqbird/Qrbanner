/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.qrbanner.app',
  appName: 'QRbanner',
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://qrbanner.com',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
