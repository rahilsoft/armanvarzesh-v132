import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function PhysioScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/physio` */ },[])
  return (<ScrollView><View style={padding:16}><Text>physio — screen</Text></View></ScrollView>)
}