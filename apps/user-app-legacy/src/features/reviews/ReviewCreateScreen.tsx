import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useCreateReview } from '../../../../packages/data/reviews/hooks';
export default function ReviewCreateScreen(){
  const { mutate: create, loading } = useCreateReview();
  const [rating,setRating] = useState('5');
  const [comment,setComment] = useState('');
  return (
    <View style={{padding:16}}>
      <Text>ثبت دیدگاه</Text>
      <TextInput value={rating} onChangeText={setRating} keyboardType="numeric" placeholder="امتیاز 1-5" />
      <TextInput value={comment} onChangeText={setComment} placeholder="نظر" />
      <Button title={loading? '...' : 'ارسال'} onPress={()=> create('coach','k1', Number(rating||'5'), comment)} />
    </View>
  );
}
