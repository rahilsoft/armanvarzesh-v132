import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function CoursesScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/courses` */ },[])
  return (<ScrollView><View style={padding:16}><Text>courses — screen</Text></View></ScrollView>)
}