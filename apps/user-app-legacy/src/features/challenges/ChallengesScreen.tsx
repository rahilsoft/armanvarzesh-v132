import React, { useState } from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useChallenges, useLeaderboard, useJoin } from '../../../../packages/data/challenges/hooks';
export default function ChallengesScreen(){
  const { data, loading, error, reload } = useChallenges();
  const [active,setActive] = useState<string>('c1');
  const { data:board, reload:rb } = useLeaderboard(active);
  const { mutate: join, loading: joining } = useJoin();
  if(loading) return <Text>...</Text>;
  if(error) return <Text>خطا</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(c=> <Text key={c.id} onPress={()=> setActive(c.id)}>{c.title} {active===c.id?'(فعال)':''}</Text>)}
      <Button title={joining? '...' : 'پیوستن'} onPress={async()=>{ await join(active); reload(); }} />
      <Text style={{marginTop:12}}>Leaderboard</Text>
      {(board||[]).map(r=> <Text key={r.rank}>{r.rank}. {r.user} — {r.score}</Text>)}
      <Button title="تازه‌سازی" onPress={rb} />
    </ScrollView>
  );
}
