import React, { useMemo } from 'react';
import React, { useMemo } from 'react';
import { Pressable, PressableProps } from 'react-native';
import { rateLimit } from '@arman/utils';

export interface DebouncedButtonProps extends PressableProps {
  debounceMs?: number;
}
const DebouncedButtonBase: React.FC<DebouncedButtonProps> = ({ debounceMs = 600, onPress, ...rest }) => {
  const allow = useMemo(() => rateLimit(debounceMs), [debounceMs]);
  return <Pressable onPress={(e) => { if (allow()) onPress?.(e); }} {...rest} />;
};
export default React.memo(DebouncedButtonBase);
