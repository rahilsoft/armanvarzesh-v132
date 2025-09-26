import React from 'react';
import { useChallenges, useLeaderboard } from '../../../../packages/data/challenges/hooks';
export default function ChallengesManager(){
  const { data, loading } = useChallenges();
  const id = data?.[0]?.id || 'c1';
  const { data: board } = useLeaderboard(id);
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>Challenges</h2>
      <div>Count: {data?.length||0}</div>
      <h3>Leaderboard</h3>
      {(board||[]).map(r=> <div key={r.rank}>{r.rank}. {r.user} — {r.score}</div>)}
    </div>
  );
}
