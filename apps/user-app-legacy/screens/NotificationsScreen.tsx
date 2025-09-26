import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useQuery, useSubscription, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../graphql/queries/notification.queries';
import { NOTIFICATION_RECEIVED } from '../graphql/subscriptions/notification.subs';
import { MARK_NOTIFICATION_READ, MARK_ALL_NOTIFICATIONS_READ } from '../graphql/mutations/notification.mutations';

const USER_ID = 1; // TODO: from auth context

export default function NotificationsScreen() {
  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS, { variables: { userId: USER_ID } });
  const { data: subData } = useSubscription(NOTIFICATION_RECEIVED, { variables: { userId: USER_ID } });
  const [items, setItems] = useState<any[]>([]);

  
const [markRead] = useMutation(MARK_NOTIFICATION_READ);
const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

const onMarkRead = async (id: number) => {
  await markRead({ variables: { id } });
  setItems(prev => prev.map(it => it.id === id ? { ...it, read: true } : it));
};
const onMarkAll = async () => {
  await markAllRead({ variables: { userId: USER_ID } });
  setItems(prev => prev.map(it => ({ ...it, read: true })));
};

    useEffect(() => {
    if (data?.notifications) setItems(data.notifications);
  }, [data]);

  useEffect(() => {
    const n = subData?.notificationReceived;
    if (n) setItems(prev => [n, ...prev]);
  }, [subData]);

  return (
    <FlatList
      style={{ padding: 16 }}
        ListHeaderComponent={(
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <Text style={{ fontWeight:'700', fontSize:18 }}>اعلان‌ها</Text>
            <Text onPress={onMarkAll} style={{ color:'#2563eb' }}>علامت‌گذاری همه به‌عنوان خوانده</Text>
          </View>
        )}
      data={items}
      keyExtractor={x => String(x.id)}
      renderItem={({ item }) => (
        <View style={{ padding:12, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:8 }}>
          <Text style={{ fontWeight:'600' }}>{new Date(item.createdAt).toLocaleString()}</Text>
          <Text>{item.text}</Text>
        </View>
      )}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => refetch()} />}
      ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:24 }}>اعلانی وجود ندارد</Text>}
    />
  );
}
