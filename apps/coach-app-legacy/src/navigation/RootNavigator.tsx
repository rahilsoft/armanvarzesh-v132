import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigation';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={ROUTES.Home}>
        {/* TODO: screens wiring here, e.g.: */}
        {/* <Stack.Screen name={ROUTES.Home} component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
