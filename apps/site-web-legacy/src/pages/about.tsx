import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { Meta } from '../../../packages/seo/meta';
import { usePage } from '../../../packages/data/cms/hooks';
import { Card } from '../../../packages/ui/components/Card';
export default function About(){
  const { data, loading, error } = usePage('about');
  return (
    <div dir="rtl">
      <Head><title>درباره — آرمان ورزش</title></Head>
      <Meta title="درباره — آرمان ورزش" description="آشنایی با تیم و رسالت ما" canonical="https://armanvarzesh.example/about" />
      <main id="main">
        {loading? '...' : error? 'خطا' : <Card><h1>{data?.title}</h1><div dangerouslySetInnerHTML={{__html: data?.body||''}} /></Card>}
      </main>
    </div>
  );
}
