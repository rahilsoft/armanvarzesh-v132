import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useReviews } from '../../../../packages/data/reviews/hooks';
export default function ReviewsListScreen(){
  const { data, loading, error } = useReviews('coach','k1');
  if(loading) return <Text>...</Text>;
  if(error) return <Text>Error</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(r=> <Text key={r.id}>{r.user}: {r.rating}/5 — {r.comment||''}</Text>)}
    </ScrollView>
  );
}
