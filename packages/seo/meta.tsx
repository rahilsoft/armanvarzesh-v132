import React from 'react';
import Head from 'next/head';

export type MetaProps = {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  locale?: 'fa_IR'|'en_US';
  noindex?: boolean;
};

export function Meta({ title, description, canonical, image, locale='fa_IR', noindex }: MetaProps){
  const site = 'https://armanvarzesh.example'; // replace in prod
  const url = canonical || site;
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:locale" content={locale} />
      {image && <meta property="og:image" content={image} />}
      {canonical && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex" />}
    </Head>
  );
}
