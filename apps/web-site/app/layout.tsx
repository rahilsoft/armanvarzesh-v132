import { useEffect } from 'react';
import { registerServiceWorker } from '../pwa/register-sw';
'use client'
import './globals.css';
    const MEDIA_CDN = process.env.NEXT_PUBLIC_MEDIA_CDN;
import React from 'react';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.armanvarzesh.com'),
  title: {
    default: 'آرمان ورزش — مربی، تغذیه و پیشرفت',
    template: '%s — آرمان ورزش'
  },
  description: 'پلتفرم حرفه‌ای مربی‌گری، تغذیه و تحلیل پیشرفت. با آرمان ورزش، برنامه اختصاصی بگیر و رشد کن.',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: '/',
    siteName: 'Arman Varzesh',
    title: 'آرمان ورزش — مربی، تغذیه و پیشرفت',
    description: 'پلتفرم حرفه‌ای مربی‌گری، تغذیه و تحلیل پیشرفت.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Arman Varzesh' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آرمان ورزش — مربی، تغذیه و پیشرفت',
    description: 'پلتفرم حرفه‌ای مربی‌گری، تغذیه و تحلیل پیشرفت.',
    images: ['/og-default.png']
  },
  alternates: { canonical: '/' }
};

import { I18nProvider } from '../lib/i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => { registerServiceWorker(); }, []);
  return (
    <html dir="rtl" lang="fa">
      <body>
      <FlagsProvider>
    <a href="#main" className="skip-main">پرش به محتوا</a>
  <body>
      <FlagsProvider>
        <I18nProvider>{children}</I18nProvider>
        {/* Schema.org Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Arman Varzesh",
            "url": (process.env.NEXT_PUBLIC_SITE_URL || "https://www.armanvarzesh.com"),
            "logo": "/logo.png",
            "sameAs": [
              "https://www.instagram.com/armanvarzesh",
              "https://www.linkedin.com/company/armanvarzesh"
            ]
          })
        }} />
        <PageviewListener />
          </FlagsProvider>
    <script dangerouslySetInnerHTML={{__html: `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js');
  });
}`}} />
</body>
    </html>
  );
}
