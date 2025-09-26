import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function AffiliateScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/affiliate` */ },[])
  return (<ScrollView><View style={padding:16}><Text>affiliate — screen</Text></View></ScrollView>)
}