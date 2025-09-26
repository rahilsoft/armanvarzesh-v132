
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import BlockItemEditor from './BlockItemEditor';
import ProtocolPicker from './ProtocolPicker';

export default function BlockEditor({ block, onChange, onRemove }:{ block:any; onChange:(patch:any)=>void; onRemove:()=>void }){
  return (
    <View style={{ borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:10, marginBottom:10 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ fontWeight:'700' }}>بلوک {block.order+1} — {label(block.type)}</Text>
        <TouchableOpacity onPress={onRemove}><Text style={{ color:'#c00' }}>حذف بلوک</Text></TouchableOpacity>
      
        <View style={{ flexDirection:'row', gap:6, marginTop:8 }}>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_UP' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↑</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_DOWN' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↓</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'DUPLICATE' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>کپی بلوک</Text></TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
        {['WARMUP','MAIN','COOLDOWN'].map(s=> (
          <TouchableOpacity key={s} onPress={()=> onChange({ section:s })}>
            <Text style={{ paddingHorizontal:8, paddingVertical:6, borderRadius:100, backgroundColor: (block.section||'MAIN')===s? '#111':'#f2f2f2', color: (block.section||'MAIN')===s?'#fff':'#111' }}>{s==='WARMUP'?'گرم‌کردن': s==='COOLDOWN'?'سردکردن':'تمرین اصلی'}</Text>
          </TouchableOpacity>
        ))}
      
        <View style={{ flexDirection:'row', gap:6, marginTop:8 }}>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_UP' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↑</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_DOWN' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↓</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'DUPLICATE' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>کپی بلوک</Text></TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
        {['SINGLE','SUPERSET','TRISET','CIRCUIT'].map(t=> (
          <TouchableOpacity key={t} onPress={()=> onChange({ type:t })}>
            <Text style={{ paddingHorizontal:8, paddingVertical:6, borderRadius:100, backgroundColor: block.type===t? '#111':'#f2f2f2', color: block.type===t?'#fff':'#111' }}>{label(t)}</Text>
          </TouchableOpacity>
        ))}
      
        <View style={{ flexDirection:'row', gap:6, marginTop:8 }}>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_UP' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↑</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_DOWN' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↓</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'DUPLICATE' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>کپی بلوک</Text></TouchableOpacity>
        </View>
      </View>
      <View style={{ height:8 }} />
      <ProtocolPicker value={{ name:block.protocol, params:block.protocolParams }} onChange={(val)=> onChange({ protocol: val?.name, protocolParams: val?.params })} />
      <View style={{ height:8 }} />
      {(block.items||[]).map((it:any, i:number)=> (
        <BlockItemEditor key={i} item={it} onChange={(patch)=>{
          const arr = [...(block.items||[])]; arr[i] = { ...arr[i], ...patch }; onChange({ items: arr });
        }} onRemove={()=>{
          const arr = (block.items||[]).filter((_:any, idx:number)=> idx!==i); onChange({ items: arr });
        }} />
      ))}
      <TouchableOpacity onPress={()=> onChange({ items:[...(block.items||[]), { order:(block.items?.length||0), exercise:null, note:'', sets:[{ reps:10, weight:0, rest:60, tempo:'2-1-2' }] }] })}>
        <Text style={{ color:'#2a6cfb' }}>+ افزودن تمرین به این بلوک</Text>
      </TouchableOpacity>
      <View style={{ height:8 }} />
      <TextInput placeholder="استراحت بین آیتم‌های بلوک (ثانیه)" keyboardType="numeric" value={String(block.restBetweenItems||'')} onChangeText={(v)=> onChange({ restBetweenItems: Number(v)||0 })}
        style={{ borderWidth:1, borderColor:'#eee', borderRadius:8, paddingHorizontal:10, height:40 }} />
    
        <View style={{ flexDirection:'row', gap:6, marginTop:8 }}>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_UP' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↑</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'MOVE_DOWN' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>↓</Text></TouchableOpacity>
          <TouchableOpacity onPress={()=> onChange({ _action:'DUPLICATE' })}><Text style={{ padding:6, borderRadius:8, backgroundColor:'#f2f2f2' }}>کپی بلوک</Text></TouchableOpacity>
        </View>
      </View>
  );
}

function label(t:string){
  switch(t){ case 'SUPERSET': return 'سوپرست'; case 'TRISET': return 'تری‌ست'; case 'CIRCUIT': return 'سیرکیت'; default: return 'تکی'; }
}
