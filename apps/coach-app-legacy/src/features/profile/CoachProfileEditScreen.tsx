import React from 'react';
import { ScrollView, Text, TextInput, Button } from 'react-native';
import { useCoach, useCoachUpdate } from '../../../../packages/data/coaches/hooks';
export default function CoachProfileEditScreen(){
  const { data, loading } = useCoach('c1');
  const { mutate: update, loading: saving } = useCoachUpdate();
  const [bio,setBio] = React.useState('');
  React.useEffect(()=>{ if(data?.bio) setBio(data.bio); },[data?.bio]);
  if(loading) return <Text>...</Text>;
  return (
    <ScrollView contentContainerStyle={{padding:16}}>
      <Text>ویرایش پروفایل</Text>
      <TextInput value={bio} onChangeText={setBio} />
      <Button title={saving? '...' : 'ذخیره'} onPress={()=> update('c1', { bio })} />
    </ScrollView>
  );
}
