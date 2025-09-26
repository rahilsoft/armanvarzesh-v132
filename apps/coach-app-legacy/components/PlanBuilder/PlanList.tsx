
import React from 'react';
import { FlatList } from 'react-native';
import PlanCard from './PlanCard';

const plans = [
  { id: '1', title: 'Weight Loss', sessions: 12 },
  { id: '2', title: 'Hypertrophy', sessions: 8 }
];

const PlanList = () => (
  <FlatList
    data={plans}
    keyExtractor={item => item.id}
    renderItem={({ item }) => <PlanCard {...item} />}
  />
);

export default PlanList;
