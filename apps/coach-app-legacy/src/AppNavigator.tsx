
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '@context/AuthContext';
import { ApolloProvider } from "@apollo/client";
import client from '@graphql/client';
import AuthStack from '@navigation/AuthStack';
import MainTabNavigator from '@navigation/MainTabNavigator';
import SplashScreen from '@screens/SplashScreen';
import useAuth from '@hooks/useAuth';

const Stack = createNativeStackNavigator();

function RootSwitch(){
  const { token, loading } = useAuth();
  if (loading) return <SplashScreen />;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator(){
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NavigationContainer>
          <RootSwitch />
        </NavigationContainer>
      </AuthProvider>
    </ApolloProvider>
  );
}
