import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function PaymentsScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/payments` */ },[])
  return (<ScrollView><View style={padding:16}><Text>payments — screen</Text></View></ScrollView>)
}