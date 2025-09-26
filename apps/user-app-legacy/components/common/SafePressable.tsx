import React, { useMemo } from 'react';
import { Pressable, PressableProps } from 'react-native';
import { rateLimit } from '@arman/utils';

export const SafePressable: React.FC<PressableProps & { minInterval?: number }> = ({ minInterval = 600, onPress, ...rest }) => {
  const allow = useMemo(() => rateLimit(minInterval), [minInterval]);
  return <Pressable onPress={(e) => { if (allow()) onPress?.(e); }} {...rest} />;
};
export default SafePressable;
