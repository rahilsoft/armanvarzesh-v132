import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function NotificationsScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/notifications` */ },[])
  return (<ScrollView><View style={padding:16}><Text>notifications — screen</Text></View></ScrollView>)
}