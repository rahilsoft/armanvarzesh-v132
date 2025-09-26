import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useReviews } from '../../../../packages/data/reviews/hooks';
export default function CoachReviewsScreen(){
  const { data, loading } = useReviews('coach','k1');
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>دیدگاه‌های مربی</Text>
      {loading? <Text>...</Text> : (data||[]).map(r=> <Text key={r.id}>{r.user}: {r.rating}/5</Text>)}
    </ScrollView>
  );
}
