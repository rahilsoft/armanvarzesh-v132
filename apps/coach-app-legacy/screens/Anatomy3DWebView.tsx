
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Anatomy3DWebView(){
  return (
    <View style={{ flex:1 }}>
      <WebView source={{ uri: 'https://vitrin.local/anatomy' }} onMessage={(e)=>{ try{ const msg = JSON.parse(e.nativeEvent.data); if (msg?.type==='muscle' && msg.code){ navigation.navigate('ExerciseLibrary', { muscle: msg.code }); } }catch(err){} }} />
    </View>
  );
}
