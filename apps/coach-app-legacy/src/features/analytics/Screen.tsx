import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function AnalyticsScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/analytics` */ },[])
  return (<ScrollView><View style={padding:16}><Text>analytics — screen</Text></View></ScrollView>)
}