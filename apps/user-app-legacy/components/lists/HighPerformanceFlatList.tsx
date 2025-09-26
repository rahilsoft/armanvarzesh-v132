import React, { useCallback } from 'react';
import { FlatList, FlatListProps } from 'react-native';
export function HighPerformanceFlatList<T>(props: FlatListProps<T>) {
  const keyExtractor = props.keyExtractor ?? ((item: any, index: number) => (item?.id ? String(item.id) : String(index)));
  const getItemLayout = props.getItemLayout ?? ((_: any, index: number) => ({ length: 72, offset: 72 * index, index }));
  return <FlatList removeClippedSubviews windowSize={5} initialNumToRender={10} keyExtractor={keyExtractor} getItemLayout={getItemLayout} {...props} />;
}
export default HighPerformanceFlatList;
