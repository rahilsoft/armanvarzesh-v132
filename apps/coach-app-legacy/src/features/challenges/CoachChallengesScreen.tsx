import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useChallenges } from '../../../../packages/data/challenges/hooks';
export default function CoachChallengesScreen(){
  const { data, loading } = useChallenges();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(c=> <Text key={c.id}>{c.title}</Text>)}
    </ScrollView>
  );
}
