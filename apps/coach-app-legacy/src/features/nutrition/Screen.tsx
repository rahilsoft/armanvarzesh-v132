import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function NutritionScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/nutrition` */ },[])
  return (<ScrollView><View style={padding:16}><Text>nutrition — screen</Text></View></ScrollView>)
}