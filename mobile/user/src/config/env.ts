import Constants from 'expo-constants';

const ENV = {
  dev: {
    API_URL: 'http://localhost:3000',
    GRAPHQL_URL: 'http://localhost:4000/graphql',
    WS_URL: 'ws://localhost:4000',
    LIVEKIT_URL: 'ws://localhost:7880',
  },
  staging: {
    API_URL: 'https://staging-api.armanvarzesh.com',
    GRAPHQL_URL: 'https://staging-api.armanvarzesh.com/graphql',
    WS_URL: 'wss://staging-api.armanvarzesh.com',
    LIVEKIT_URL: 'wss://staging-live.armanvarzesh.com',
  },
  prod: {
    API_URL: 'https://api.armanvarzesh.com',
    GRAPHQL_URL: 'https://api.armanvarzesh.com/graphql',
    WS_URL: 'wss://api.armanvarzesh.com',
    LIVEKIT_URL: 'wss://live.armanvarzesh.com',
  },
};

function getEnvVars() {
  const releaseChannel = Constants.expoConfig?.releaseChannel;

  if (__DEV__) {
    return ENV.dev;
  } else if (releaseChannel === 'staging') {
    return ENV.staging;
  } else {
    return ENV.prod;
  }
}

export default getEnvVars();
