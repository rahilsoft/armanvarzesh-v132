import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

// Config
import i18n from './src/config/i18n';
import apolloClient from './src/services/apollo.client';

// Stores
import { useAuthStore } from './src/store/auth.store';
import { useSettingsStore } from './src/store/settings.store';

// Services
import notificationService from './src/services/notification.service';

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { Loading } from './src/components';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Add more auth screens: Register, ForgotPassword, etc. */}
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'داشبورد',
          tabBarIcon: () => <span>🏠</span>,
        }}
      />
      {/* Add more tabs: Workout, Nutrition, Chat, Profile */}
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const { checkAuth } = useAuthStore();
  const { loadSettings, isDarkMode } = useSettingsStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Load settings
        await loadSettings();

        // Check authentication
        await checkAuth();

        // Initialize notifications
        await notificationService.initialize();

        // Wait a bit for everything to settle
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error preparing app:', error);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appReady) {
    return <Loading fullScreen message="در حال بارگذاری..." />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </I18nextProvider>
    </ApolloProvider>
  );
}
