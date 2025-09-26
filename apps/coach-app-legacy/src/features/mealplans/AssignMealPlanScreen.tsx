import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { useMealPlans } from '../../../../packages/data/mealplans/hooks';
export default function AssignMealPlanScreen(){
  const { data, loading } = useMealPlans();
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      {(data||[]).map(p=> <React.Fragment key={p.id}>
        <Text>{p.title}</Text>
        <Button title="انتساب به کاربر نمونه" onPress={()=> { /* connect to useAssignPlan */ }} />
      </React.Fragment>)}
    </ScrollView>
  );
}
