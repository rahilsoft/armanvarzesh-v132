
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, Button } from 'react-native';
import { useApolloClient, useQuery } from '@apollo/client';
import { CLIENTS_LIST } from '@graphql/queries/clients.queries';
import ClientListItem, { ClientEdge } from '@components/Clients/ClientListItem';

export default function ClientsListScreen({ navigation } : any){
  const [search, setSearch] = useState('');
  const { data, loading, fetchMore, refetch } = useQuery(CLIENTS_LIST, { variables: { search, limit: 20 } });
  const edges: ClientEdge[] = data?.clients?.edges || [];
  const pageInfo = data?.clients?.pageInfo;

  const onEnd = useCallback(()=>{
    if (pageInfo?.hasNextPage){
      fetchMore({ variables: { cursor: pageInfo.endCursor, limit: 20, search } });
    }
  }, [pageInfo?.endCursor, pageInfo?.hasNextPage, search]);

  return (
    <View style={{flex:1, padding:12}}>
      <View style={{ flexDirection:'row', gap:8, marginBottom:8 }}>
        <TextInput placeholder="جست‌وجوی مشتری…" value={search} onChangeText={setSearch} onSubmitEditing={()=> refetch({ search })}
          style={{ flex:1, borderWidth:1, borderColor:'#eee', borderRadius:10, paddingHorizontal:12, height:40 }} />
        <Button title="افزودن" onPress={()=> navigation.navigate('AddClient')} />
      </View>
      <FlatList
        data={edges}
        keyExtractor={(it)=> it.id}
        renderItem={({ item })=> <ClientListItem item={item} onPress={(id)=> navigation.navigate('ClientProfile', { id })} />}
        onEndReached={onEnd}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={()=> refetch({ search })} />}
        ListEmptyComponent={!loading ? <Text style={{textAlign:'center', marginTop:24, opacity:.7}}>مشتری‌ای پیدا نشد</Text> : null}
      />
    </View>
  );
}
