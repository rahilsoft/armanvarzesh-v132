import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { Meta } from '../../../packages/seo/meta';
import { usePage } from '../../../packages/data/cms/hooks';
import { Card } from '../../../packages/ui/components/Card';
export default function Contact(){
  const { data, loading, error } = usePage('contact');
  return (
    <div dir="rtl">
      <Head><title>ارتباط — آرمان ورزش</title></Head>
      <Meta title="ارتباط — آرمان ورزش" description="راه‌های ارتباط" canonical="https://armanvarzesh.example/contact" />
      <main id="main">
        {loading? '...' : error? 'خطا' : <Card><h1>{data?.title}</h1><div dangerouslySetInnerHTML={{__html: data?.body||''}} /></Card>}
      </main>
    </div>
  );
}
