import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apirunner.app',
  appName: 'API Runner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
