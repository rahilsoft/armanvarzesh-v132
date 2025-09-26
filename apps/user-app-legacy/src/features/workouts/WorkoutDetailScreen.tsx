import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useWorkout, useSession } from '../../../../packages/data/workouts/hooks';
export default function WorkoutDetailScreen({ route }:any){
  const id = route?.params?.id || 'w1';
  const { data, loading } = useWorkout(id);
  const sess = useSession();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>{data?.title}</Text>
      {!sess.data ? <Button title={sess.loading? '...' : 'شروع'} onPress={()=> sess.start(id)} /> :
        <>
          <Button title="ثبت ست" onPress={()=> sess.log(data!.exercises[0].exerciseId, 1, data!.exercises[0].reps)} />
          <Button title="اتمام" onPress={()=> sess.complete()} />
        </>
      }
    </ScrollView>
  );
}
