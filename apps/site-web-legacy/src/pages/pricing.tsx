import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { Meta } from '../../../packages/seo/meta';
import { usePage } from '../../../packages/data/cms/hooks';
import { Card } from '../../../packages/ui/components/Card';
export default function Pricing(){
  const { data, loading, error } = usePage('pricing');
  return (
    <div dir="rtl">
      <Head><title>قیمت‌گذاری — آرمان ورزش</title></Head>
      <Meta title="قیمت‌گذاری — آرمان ورزش" description="پلن‌ها و قیمت‌ها" canonical="https://armanvarzesh.example/pricing" />
      <main id="main">
        {loading? '...' : error? 'خطا' : <Card><h1>{data?.title}</h1><div dangerouslySetInnerHTML={{__html: data?.body||''}} /></Card>}
      </main>
    </div>
  );
}
