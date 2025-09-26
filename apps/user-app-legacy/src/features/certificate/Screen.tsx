import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
export default function CertificateScreen() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ /* TODO: fetch `/certificate` */ },[])
  return (<ScrollView><View style={padding:16}><Text>certificate — screen</Text></View></ScrollView>)
}