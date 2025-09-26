
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../hooks/useAuth';
const API = process.env.API_URL || 'http://localhost:8080';

export default function CertificateQRScreen(){
  const { token } = useAuth();
  const [qr, setQr] = useState<string>('');
  const certId = 1;
  useEffect(()=>{
    (async ()=>{
      const r = await fetch(`${API}/v1/certificates/${certId}/qr`, { headers: { 'Authorization': `Bearer ${token}` } });
      const j = await r.json(); setQr(j?.qr||'');
    })();
  },[]);
  return (
    <View style={{ padding:16, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:22, fontWeight:'700', marginBottom:12 }}>Certificate QR</Text>
      {qr ? <QRCode value={qr} size={220} /> : <Text>Loading QR…</Text>}
    </View>
  );
}
