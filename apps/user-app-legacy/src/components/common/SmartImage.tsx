/**
SmartImage (React Native)
Wrapper around `expo-image` that enables memory/disk caching, blurhash placeholder, and transitions.
@params uri - Remote image URL
@remarks Prefer specifying explicit width/height to avoid layout jank.
*/
import React from 'react';
import { Image } from 'expo-image';
import { ImageProps } from 'react-native';

type Props = Omit<ImageProps, 'source'> & {
  uri: string;
  width?: number;
  height?: number;
  blurhash?: string;
  priority?: 'low' | 'normal' | 'high';
};
/** Cached image with optional blur placeholder (expo-image) */
const SmartImage: React.FC<Props> = ({ uri, width, height, blurhash, priority='normal', style, ...rest }) => {
  return (
    <Image
      source={{ uri }}
      style={[{ width, height }, style]}
      placeholder={blurhash ? { blurhash } : undefined}
      recyclingKey={uri}
      cachePolicy="memory-disk"
      contentFit="cover"
      transition={200}
      priority={priority}
      {...rest}
    />
  );
};
export default React.memo(SmartImage);
