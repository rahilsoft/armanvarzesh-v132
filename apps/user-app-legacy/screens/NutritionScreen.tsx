import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { FOOD_SEARCH, DAILY_SUMMARY } from '../graphql/queries/nutrition.queries';
import { LOG_MEAL } from '../graphql/mutations/nutrition.mutations';

const USER_ID = 1;

export default function NutritionScreen() {
  const [q, setQ] = useState('');
  const [grams, setGrams] = useState('100');
  const [search, { data: sdata }] = useLazyQuery(FOOD_SEARCH);
  const todayISO = new Date().toISOString().slice(0,10)+'T00:00:00Z';
  const { data: sum } = useQuery(DAILY_SUMMARY, { variables: { userId: USER_ID, dateISO: todayISO } });
  const [logMeal] = useMutation(LOG_MEAL, { onCompleted: ()=> search({ variables: { q } }) });

  return (
    <View style={{ padding:16, gap:12 }}>
      <Text style={{ fontWeight:'700', fontSize:18 }}>تغذیهٔ امروز</Text>
      <Text>کالری: {sum?.userDailyNutrition?.calories?.toFixed(0) || 0} • پروتئین: {sum?.userDailyNutrition?.protein?.toFixed(1) || 0}g • کربوهیدرات: {sum?.userDailyNutrition?.carbs?.toFixed(1) || 0}g • چربی: {sum?.userDailyNutrition?.fat?.toFixed(1) || 0}g</Text>

      <View style={{ flexDirection:'row', gap:8 }}>
        <TextInput placeholder="جستجوی غذا..." value={q} onChangeText={setQ} style={{ flex:1, borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
        <Pressable onPress={()=> search({ variables:{ q } })}><Text style={{ padding:10, borderWidth:1, borderColor:'#111', borderRadius:8 }}>جستجو</Text></Pressable>
      </View>

      <FlatList
        style={{ marginTop:8 }}
        data={sdata?.foodSearch || []}
        keyExtractor={x=>String(x.id)}
        renderItem={({ item }) => (
          <View style={{ padding:12, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:8 }}>
            <Text style={{ fontWeight:'600' }}>{item.title}</Text>
            <Text>در هر ۱۰۰ گرم: {item.calories} kcal • P {item.protein} • C {item.carbs} • F {item.fat}</Text>
            <View style={{ flexDirection:'row', gap:8, marginTop:8 }}>
              <TextInput placeholder="گرم" value={grams} onChangeText={setGrams} keyboardType="numeric" style={{ width:90, borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:8 }} />
              <Pressable onPress={()=> logMeal({ variables:{ input:{ userId: USER_ID, foodId: item.id, grams: Number(grams||'0') } } })}>
                <Text style={{ padding:10, backgroundColor:'#111', color:'#fff', borderRadius:8 }}>افزودن</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>نتیجه‌ای نیست</Text>}
      />
    </View>
  );
}
