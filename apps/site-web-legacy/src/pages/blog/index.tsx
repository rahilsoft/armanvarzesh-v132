import React from 'react';
import Head from 'next/head';
import '../../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../../packages/ui/components/Card';
import { Meta } from '../../../../packages/seo/meta';
import { usePosts } from '../../../../packages/data/cms/hooks';
import { SkipLink } from '../../../../packages/ui/components/SkipLink';

export default function BlogIndex(){
  const { data, loading, error } = usePosts();
  return (
    <div dir="rtl">
      <Head><title>بلاگ — آرمان ورزش</title></Head>
      <Meta title="بلاگ — آرمان ورزش" description="مقالات تمرین و تغذیه" canonical="https://armanvarzesh.example/blog" />
      <SkipLink/>
      <main id="main">
        <h1>بلاگ</h1>
        {loading? '...' : error? 'خطا' :
          <div style={{display:'grid', gap:12}}>
            {(data||[]).map(p=> <Card key={p.slug}><b>{p.title}</b><p>{p.excerpt||''}</p><Link href={`/blog/${p.slug}`}>ادامه</Link></Card>)}
          </div>
        }
      </main>
    </div>
  );
}
