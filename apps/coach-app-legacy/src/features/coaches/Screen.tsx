import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function CoachesScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/coaches` */ },[])
  return (<ScrollView><View style={padding:16}><Text>coaches — screen</Text></View></ScrollView>)
}