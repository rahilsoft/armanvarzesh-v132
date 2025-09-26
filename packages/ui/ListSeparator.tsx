import React from 'react';
import { View } from 'react-native';
export const ListSeparator: React.FC<{height?: number}> = ({ height = 8 }) => <View style={{ height }} />;
export default ListSeparator;
