import React, { memo, useMemo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import ClientCard, { ClientCardProps } from './ClientCard';

const ClientList: React.FC = () => {
  const clients = useMemo<ClientCardProps[]>(() => [
    { name: 'Ali Ahmadi', level: 'Intermediate' },
    { name: 'Sara Gholami', level: 'Beginner' },
  ], []);

  const keyExtractor = useCallback((item: ClientCardProps, index: number) => `${item.name}-${index}`, []);
  const renderItem: ListRenderItem<ClientCardProps> = useCallback(({ item }) => <ClientCard {...item} />, []);

  return (<FlatList data={clients} keyExtractor={keyExtractor} renderItem={renderItem} ListEmptyComponent={null} />);
};

export default memo(ClientList);
