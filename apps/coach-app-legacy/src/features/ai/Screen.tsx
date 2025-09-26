import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function AiScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/ai` */ },[])
  return (<ScrollView><View style={padding:16}><Text>ai — screen</Text></View></ScrollView>)
}