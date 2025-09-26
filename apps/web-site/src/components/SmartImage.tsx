/**
SmartImage (Web)
Wrapper around `next/image` with sensible defaults for lazy loading and quality.
@remarks Always pass exact width/height to minimize CLS.
*/
import React from 'react';
import Image, { ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt?: string;
  width: number;
  height: number;
  quality?: number;
  priority?: boolean;
};

const SmartImage: React.FC<Props> = ({ src, alt = '', width, height, quality = 70, priority = false, ...rest }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      loading={priority ? undefined : 'lazy'}
      placeholder="empty"
      {...rest}
    />
  );
};

export default React.memo(SmartImage);
