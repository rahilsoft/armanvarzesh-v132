import React from 'react';
type Props = React.ImgHTMLAttributes<HTMLImageElement> & { alt: string };
export const Img: React.FC<Props> = ({ alt, loading='lazy', decoding='async', ...rest })=>{
  if(!alt || alt.trim().length===0){
    if(process.env.NODE_ENV !== 'production') console.warn('[Img] alt text is required');
  }
  return <img alt={alt} loading={loading} decoding={decoding} {...rest} />;
};
export default Img;
