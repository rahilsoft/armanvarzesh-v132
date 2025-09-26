
import React from 'react';
import { FlatList } from 'react-native';
import WorkoutCard from './WorkoutCard';

const workouts = [
  { id: '1', title: 'HIIT', duration: 25 },
  { id: '2', title: 'Strength', duration: 45 }
];

const WorkoutList = () => (
  <FlatList
    data={workouts}
    keyExtractor={item => item.id}
    renderItem={({ item }) => <WorkoutCard {...item} />}
  />
);

export default WorkoutList;
