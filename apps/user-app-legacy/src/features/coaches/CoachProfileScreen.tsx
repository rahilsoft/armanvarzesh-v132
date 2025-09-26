import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useCoach } from '../../../../packages/data/coaches/hooks';
import { useReviews } from '../../../../packages/data/reviews/hooks';
export default function CoachProfileScreen({ route }:any){
  const id = route?.params?.id || 'c1';
  const { data, loading } = useCoach(id);
  const { data: reviews } = useReviews(id);
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>{data?.name}</Text>
      {(reviews||[]).map(r=> <Text key={r.id}>⭐ {r.stars} — {r.comment||''}</Text>)}
    </ScrollView>
  );
}
