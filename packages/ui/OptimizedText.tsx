/**
OptimizedText
Memoized Text component for RN to avoid unnecessary re-renders of static text blocks.
*/
import React from 'react';
import { Text, TextProps } from 'react-native';
const OptimizedTextBase: React.FC<TextProps> = (props) => <Text {...props} />;
export const OptimizedText = React.memo(OptimizedTextBase);
export default OptimizedText;
