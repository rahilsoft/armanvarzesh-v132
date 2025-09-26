
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '@screens/DashboardScreen';
import WorkoutListScreen from '@screens/WorkoutListScreen';
import NutritionScreen from '@screens/NutritionScreen';
import LeaderboardScreen from '@screens/LeaderboardScreen';
import ProfileScreen from '@screens/ProfileScreen';
import MedicalScreen from '@screens/MedicalScreen';

import InboxScreen from '@screens/InboxScreen';

import CoursePlayerScreen from '@screens/CoursePlayerScreen';
import CertificateQRScreen from '@screens/CertificateQRScreen';
import VIPScreen from '@screens/VIPScreen';
import AffiliateScreen from '@screens/AffiliateScreen';
import CoachKpiScreen from '@screens/CoachKpiScreen';

import ActivitiesScreen from '@screens/ActivitiesScreen';
import TimerScreen from '@screens/TimerScreen';
import ChallengesScreen from '@screens/ChallengesScreen';

import HabitsScreen from '@screens/HabitsScreen';
import SocialCompareScreen from '@screens/SocialCompareScreen';


const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Habits" component={HabitsScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen name="Hydration" component={HydrationScreen} />
    <Tab.Screen name="Upgrade" component={PaywallScreen} />
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Workouts" component={WorkoutListScreen} />
    <Tab.Screen name="Nutrition" component={NutritionScreen} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Compare" component={SocialCompareScreen} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
    <Tab.Screen name="Timer" component={TimerScreen} />
    <Tab.Screen name="Challenges" component={ChallengesScreen} />
      <Tab.Screen name="Courses" component={CoursePlayerScreen} />
    <Tab.Screen name="VIP" component={VIPScreen} />
    <Tab.Screen name="Affiliate" component={AffiliateScreen} />
    <Tab.Screen name="Coach KPIs" component={CoachKpiScreen} />
    <Tab.Screen name="Certificate" component={CertificateQRScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Medical" component={MedicalScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;
