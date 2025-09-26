import * as Linking from 'expo-linking';

export const linking = {
  prefixes: ['arman://', 'https://app.armanvarzesh.ir'],
  config: {
    screens: {
      Home: 'home',
      Session: 'session/:id',
      Booking: 'booking/:id',
      Review: 'review/:id'
    }
  },
  async getInitialURL(){ return await Linking.getInitialURL(); },
  subscribe(listener: (url: string) => void){
    const sub = Linking.addEventListener('url', ({ url }) => listener(url));
    return ()=> sub.remove();
  }
};
