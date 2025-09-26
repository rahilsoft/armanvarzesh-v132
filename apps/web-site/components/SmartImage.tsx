import Image, { ImageProps } from 'next/image';
export default function SmartImage(props: ImageProps){
  return <Image loading="lazy" sizes="(max-width: 768px) 100vw, 700px" {...props} />;
}
