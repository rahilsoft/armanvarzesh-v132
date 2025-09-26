import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useQuery } from '@apollo/client';
import { COACH_RESERVATIONS } from '../graphql/queries/availability.queries';

const COACH_ID = "10"; // TODO: auth

export default function ReservationsScreen() {
  const { data } = useQuery(COACH_RESERVATIONS, { variables: { coachId: COACH_ID } });

  return (
    <FlatList
      style={{ padding:16 }}
      data={data?.coachReservations || []}
      keyExtractor={x => String(x.id)}
      renderItem={({ item }) => (
        <View style={{ padding:12, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:8 }}>
          <Text>کاربر #{item.userId}</Text>
          <Text>{new Date(item.startsAt).toLocaleString()} → {new Date(item.endsAt).toLocaleString()}</Text>
          <Text>وضعیت: {item.status}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:24 }}>رزروی ثبت نشده</Text>}
    />
  );
}
