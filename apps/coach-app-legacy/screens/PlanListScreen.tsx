
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, RefreshControl, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { DUPLICATE_PLAN, PUBLISH_PLAN, PLANS_LIST } from '@graphql/queries/plans.queries';
import PlanCard from '@components/Plans/PlanCard';

export default function PlanListScreen({ navigation } : any){
  const [search, setSearch] = useState('');
  const { data, loading, refetch, fetchMore } = useQuery(PLANS_LIST, { variables: { search, limit: 20 } });
  const [duplicate] = useMutation(DUPLICATE_PLAN, { refetchQueries: [{ query: PLANS_LIST, variables: { search, limit: 20 } }] });
  const [publish] = useMutation(PUBLISH_PLAN, { refetchQueries: [{ query: PLANS_LIST, variables: { search, limit: 20 } }] });

  const edges = data?.plans?.edges || [];
  const pageInfo = data?.plans?.pageInfo;

  return (
    <View style={{ flex:1, padding:12 }}>
      <View style={{ flexDirection:'row', gap:8, marginBottom:8 }}>
        <TextInput placeholder="جست‌وجوی برنامه…" value={search} onChangeText={setSearch} onSubmitEditing={()=> refetch({ search })}
          style={{ flex:1, borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:40 }} />
        <Button title="ساخت برنامه" onPress={()=> navigation.navigate('PlanEditor')} />
      </View>
      <FlatList
        data={edges}
        keyExtractor={(it)=> it.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={()=> refetch({ search })} />}
        onEndReached={()=> { if (pageInfo?.hasNextPage) fetchMore({ variables: { cursor: pageInfo.endCursor, limit: 20, search } }); }}
        onEndReachedThreshold={0.4}
        renderItem={({ item })=> (
          <PlanCard plan={item} onPress={()=> navigation.navigate('PlanEditor', { id: item.id })} onMore={()=>{
            Alert.alert('عملیات', '', [
              { text:'انتشار', onPress:()=> publish({ variables: { id: item.id } }) },
              { text:'کپی', onPress:()=> duplicate({ variables: { id: item.id } }) },
              { text:'انصراف', style:'cancel' }
            ]);
          }} />
        )}
        ItemSeparatorComponent={()=> <View style={{ height:10 }} />}
        ListEmptyComponent={!loading ? <Text style={{ textAlign:'center', opacity:.6, marginTop:24 }}>برنامه‌ای یافت نشد</Text> : null}
      />
    </View>
  );
}
