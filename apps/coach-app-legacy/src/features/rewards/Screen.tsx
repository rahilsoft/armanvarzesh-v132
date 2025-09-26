import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function RewardsScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/rewards` */ },[])
  return (<ScrollView><View style={padding:16}><Text>rewards — screen</Text></View></ScrollView>)
}