import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { USER_RESERVATIONS } from '../graphql/queries/reservation.queries';
import { CANCEL_RESERVATION } from '../graphql/mutations/reservation.mutations';

const USER_ID = "1"; // TODO: from auth

export default function ReservationsScreen() {
  const { data, loading, refetch } = useQuery(USER_RESERVATIONS, { variables: { userId: USER_ID } });
  const [cancelReservation] = useMutation(CANCEL_RESERVATION);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { if (data?.userReservations) setItems(data.userReservations); }, [data]);

  const onCancel = async (id: string) => {
    await cancelReservation({ variables: { id } });
    setItems(prev => prev.filter(x => x.id !== id));
  };

  return (
    <FlatList
      style={{ padding: 16 }}
      data={items}
      keyExtractor={x => String(x.id)}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => refetch()} />}
      renderItem={({ item }) => (
        <View style={{ padding:12, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:8 }}>
          <Text style={{ fontWeight:'600' }}>رزرو با مربی #{item.coachId}</Text>
          <Text>{new Date(item.startsAt).toLocaleString()} → {new Date(item.endsAt).toLocaleString()}</Text>
          <Text>وضعیت: {item.status}</Text>
          <Pressable onPress={() => onCancel(item.id)}>
            <Text style={{ color:'#dc2626', marginTop:8 }}>لغو رزرو</Text>
          </Pressable>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:24 }}>رزروی ثبت نشده</Text>}
    />
  );
}
