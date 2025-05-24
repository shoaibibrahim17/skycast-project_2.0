// This file will manage environment-specific configurations.

// __DEV__ is a global variable set by React Native.
// It's true when the app is running in development mode (e.g., with Expo Go or a debug build)
// and false when it's a production build.

const IS_DEVELOPMENT = __DEV__;

// Define your backend URLs
const DEVELOPMENT_BACKEND_URL = 'http://192.168.219.197:3000'; // Your local IP for testing with Expo Go
const PRODUCTION_BACKEND_URL = 'https://shoaibibrahim-skycast-backend.onrender.com'; // Your live Render URL

// Export the appropriate URL based on the environment
export const BACKEND_URL = IS_DEVELOPMENT
  ? DEVELOPMENT_BACKEND_URL
  : PRODUCTION_BACKEND_URL;

// You can add other environment-specific configurations here in the future
// export const SOME_OTHER_API_KEY = IS_DEVELOPMENT ? 'dev_key' : 'prod_key';