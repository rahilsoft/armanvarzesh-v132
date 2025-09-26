'use client';
import React from 'react';
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());

export default function SignedImage({ fileKey, alt, width, height }:{
  fileKey: string; alt: string; width: number; height: number;
}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const { data } = useSWR(`${base}/graphql?op=signedDownloadUrl&key=${encodeURIComponent(fileKey)}`, async () => {
    const res = await fetch(`${base}/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: `query($k:String!){ signedDownloadUrl(key:$k){ downloadUrl } }`, variables: { k: fileKey } })
    });
    const json = await res.json();
    return json.data?.signedDownloadUrl?.downloadUrl;
  });

  if (!data) return <div style={{width, height, background:'#f3f4f6', borderRadius:12}} />;
  return <Image src={data} alt={alt} width={width} height={height} />;
}
