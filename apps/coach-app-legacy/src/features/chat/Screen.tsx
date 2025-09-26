import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function ChatScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/chat` */ },[])
  return (<ScrollView><View style={padding:16}><Text>chat — screen</Text></View></ScrollView>)
}