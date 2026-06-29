import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { AppTabParamList } from './types';
import { colors } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { CoachesScreen } from '../screens/CoachesScreen';
import { WorkoutsScreen } from '../screens/WorkoutsScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();

const icons: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Coaches: 'people',
  Workouts: 'barbell',
  Nutrition: 'nutrition',
  Profile: 'person',
};

const labels: Record<keyof AppTabParamList, string> = {
  Home: 'خانه',
  Coaches: 'مربیان',
  Workouts: 'تمرین',
  Nutrition: 'تغذیه',
  Profile: 'پروفایل',
};

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabel: labels[route.name],
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Coaches" component={CoachesScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
