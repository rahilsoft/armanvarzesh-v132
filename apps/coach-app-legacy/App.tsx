import React, { useEffect } from 'react';
import { I18nManager, Text, View } from 'react-native';
import AppNavigator from './src/AppNavigator';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({ Yekan: require('./assets/fonts/Yekan.ttf') });

  useEffect(() => {
    try {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    } catch {}
  }, []);

  if (!fontsLoaded) return <View />;

  const oldRender = Text.render;
  // @ts-ignore – force default font family
  Text.render = function (...args) {
    const origin = oldRender.call(this, ...args);
    return React.cloneElement(origin, { style: [{ fontFamily: 'Yekan' }, origin.props.style] });
  };

  return <AppNavigator />;
}
