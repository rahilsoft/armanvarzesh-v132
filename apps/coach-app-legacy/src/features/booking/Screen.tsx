import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function BookingScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/booking` */ },[])
  return (<ScrollView><View style={padding:16}><Text>booking — screen</Text></View></ScrollView>)
}