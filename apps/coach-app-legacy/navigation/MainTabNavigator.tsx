
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import ClientsListScreen from '@screens/ClientsListScreen';
import ClientProfileScreen from '@screens/ClientProfileScreen';
import AddClientScreen from '@screens/AddClientScreen';
import PlanListScreen from '@screens/PlanListScreen';
import PlanEditorScreen from '@screens/PlanEditorScreen';
import ExerciseLibraryScreen from '@screens/ExerciseLibraryScreen';
import AssignPlanScreen from '@screens/AssignPlanScreen';

function Dashboard(){ return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>Dashboard</Text></View>; }
function Profile(){ return <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>Profile</Text></View>; }

const ClientsStack = createNativeStackNavigator();
function ClientsStackNav(){
  return (
    <ClientsStack.Navigator>
      <ClientsStack.Screen name="ClientsList" component={ClientsListScreen} options={{ title:'مشتریان' }} />
      <ClientsStack.Screen name="ClientProfile" component={ClientProfileScreen} options={{ title:'پروفایل مشتری' }} />
      <ClientsStack.Screen name="AddClient" component={AddClientScreen} options={{ title:'افزودن مشتری' }} />
    </ClientsStack.Navigator>
  );
}

const PlansStack = createNativeStackNavigator();
function PlansStackNav(){
  return (
    <PlansStack.Navigator>
      <PlansStack.Screen name="PlanList" component={PlanListScreen} options={{ title:'برنامه‌ها' }} />
      <PlansStack.Screen name="PlanEditor" component={PlanEditorScreen} options={{ title:'ویرایش برنامه' }} />
      <PlansStack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} options={{ title:'کتابخانهٔ حرکات' }} />
      <PlansStack.Screen name="AssignPlan" component={AssignPlanScreen} options={{ title:'اختصاص برنامه' }} />
    </PlansStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
export default function MainTabNavigator(){
  return (
    <Tab.Navigator screenOptions={{ headerShown:false }}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Clients" component={ClientsStackNav} />
      <Tab.Screen name="Plans" component={PlansStackNav} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
