import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function MonitoringScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/monitoring` */ },[])
  return (<ScrollView><View style={padding:16}><Text>monitoring — screen</Text></View></ScrollView>)
}