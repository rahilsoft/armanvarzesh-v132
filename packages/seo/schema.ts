export function articleLD({ headline, description, datePublished, dateModified, author, url }:{
  headline:string; description?:string; datePublished:string; dateModified?:string; author:string; url:string;
}){
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline, description, datePublished, dateModified, author: { '@type': 'Person', name: author }, mainEntityOfPage: url
  };
}
export function orgLD({ name, url, logo }:{ name:string; url:string; logo?:string }){
  return {
    '@context':'https://schema.org',
    '@type':'Organization',
    name, url, logo
  };
}
