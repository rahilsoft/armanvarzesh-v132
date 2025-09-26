import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useLogMeal } from '../../../../packages/data/nutrition/hooks';
export default function MealLogScreen(){
  const { mutate, loading, error } = useLogMeal();
  const [name,setName] = useState('Chicken breast');
  const [calories,setCalories] = useState('300');
  const [protein,setProtein] = useState('40');
  return (
    <View style={{padding:16}}>
      <Text>ثبت وعده</Text>
      <TextInput value={name} onChangeText={setName} />
      <TextInput value={calories} onChangeText={setCalories} keyboardType="numeric" />
      <TextInput value={protein} onChangeText={setProtein} keyboardType="numeric" />
      <Button title={loading?'...':'ثبت'} onPress={async()=>{ await mutate(name, Number(calories||'0'), Number(protein||'0'), new Date().toISOString()); setCalories(''); setProtein(''); }} />
      {error && <Text>خطا</Text>}
    </View>
  );
}
