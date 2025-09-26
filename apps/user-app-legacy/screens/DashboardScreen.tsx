
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
const API = process.env.API_URL || 'http://localhost:8080';
import { useAuth } from '../hooks/useAuth';

function TodayCard(){
  const { token } = useAuth();
  const [sumWater, setSumWater] = useState(0);
  useEffect(()=>{
    (async ()=>{
      try{
        const r = await fetch(`${API}/v1/habits/today`, { headers: { 'Authorization': `Bearer ${token}` }});
        const j = await r.json();
        const water = (j.items||[]).find((x:any)=>x.habit.type==='water');
        setSumWater(water? water.sum : 0);
      }catch(e){}
    })();
  },[]);
  return (
    <View style={{ padding: 12, borderWidth:1, margin: 12, borderRadius: 8 }}>
      <Text style={{ fontWeight:'700' }}>Habits — Today</Text>
      <Text>Water: {sumWater} ml</Text>
    </View>
  );
}


import React from 'react';
import { View, Text } from 'react-native';

const DashboardScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Dashboard</Text>
  </View>
);
</>

export default DashboardScreen;
