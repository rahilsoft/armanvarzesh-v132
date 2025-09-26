import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { COACH_AVAILABILITY } from '../graphql/queries/availability.queries';
import { CREATE_AVAILABILITY } from '../graphql/mutations/availability.mutations';

const COACH_ID = "10"; // TODO: auth

export default function AvailabilityScreen() {
  const { data, refetch } = useQuery(COACH_AVAILABILITY, { variables: { coachId: COACH_ID } });
  const [createAvailability] = useMutation(CREATE_AVAILABILITY);
  const [start, setStart] = useState('2025-08-25T10:00:00Z');
  const [end, setEnd] = useState('2025-08-25T11:00:00Z');
  const [rrule, setRrule] = useState('');

  const onCreate = async () => {
    await createAvailability({ variables: { input: { coachId: COACH_ID, start, end, recurrence: rrule || null } } });
    await refetch();
  };

  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontWeight:'700', fontSize:18, marginBottom:12 }}>زمان‌های در دسترس</Text>
      <View style={{ gap:8 }}>
        <TextInput placeholder="Start ISO" value={start} onChangeText={setStart} style={{ borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:8 }} />
        <TextInput placeholder="End ISO" value={end} onChangeText={setEnd} style={{ borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:8 }} />
        <TextInput placeholder="RRULE (اختیاری)" value={rrule} onChangeText={setRrule} style={{ borderWidth:1, borderColor:'#ddd', padding:8, borderRadius:8 }} />
        <Pressable onPress={onCreate}><Text style={{ color:'#2563eb' }}>ثبت</Text></Pressable>
      </View>

      <FlatList
        style={{ marginTop:16 }}
        data={data?.coachAvailability || []}
        keyExtractor={x => String(x.id)}
        renderItem={({ item }) => (
          <View style={{ padding:12, borderWidth:1, borderColor:'#eee', borderRadius:12, marginBottom:8 }}>
            <Text>{new Date(item.start).toLocaleString()} → {new Date(item.end).toLocaleString()}</Text>
            {item.recurrence ? <Text>تکرار: {item.recurrence}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
