import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function VipScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/vip` */ },[])
  return (<ScrollView><View style={padding:16}><Text>vip — screen</Text></View></ScrollView>)
}