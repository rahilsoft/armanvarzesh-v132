import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function AssessmentsScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/assessments` */ },[])
  return (<ScrollView><View style={padding:16}><Text>assessments — screen</Text></View></ScrollView>)
}