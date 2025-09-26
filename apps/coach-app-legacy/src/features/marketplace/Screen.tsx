import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function MarketplaceScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/marketplace` */ },[])
  return (<ScrollView><View style={padding:16}><Text>marketplace — screen</Text></View></ScrollView>)
}