import React from 'react';
import Head from 'next/head';
import '../../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Meta } from '../../../../packages/seo/meta';
import { articleLD } from '../../../../packages/seo/schema';
import { usePost } from '../../../../packages/data/cms/hooks';
import { Card } from '../../../../packages/ui/components/Card';

export default function BlogPost(){
  const router = useRouter();
  const slug = String(router.query.slug||'welcome');
  const { data, loading, error } = usePost(slug);
  const url = `https://armanvarzesh.example/blog/${slug}`;
  const ld = data? articleLD({ headline: data.title, description: data.excerpt, datePublished: data.at, author: data.author, url }) : null;
  return (
    <div dir="rtl">
      <Head><title>{data? data.title : 'مقاله'} — آرمان ورزش</title></Head>
      <Meta title={(data? data.title : 'مقاله')+' — آرمان ورزش'} description={data?.excerpt} canonical={url} />
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}}/>}
      <main id="main">
        {loading? '...' : error? 'خطا' : !data? 'یافت نشد' :
          <Card>
            <h1>{data.title}</h1>
            <div dangerouslySetInnerHTML={{__html: data.body}} />
          </Card>
        }
      </main>
    </div>
  );
}
