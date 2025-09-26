import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function WorkoutsScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/workouts` */ },[])
  return (<ScrollView><View style={padding:16}><Text>workouts — screen</Text></View></ScrollView>)
}