import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html dir="rtl" lang="fa">
        <Head>
          <script id="THEME_PREPAINT" dangerouslySetInnerHTML={{__html: `
            try {
              var key='theme';var s=localStorage.getItem(key);
              var t=s|| (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
              document.documentElement.setAttribute('data-theme', t);
            } catch(e) {}
          `}} />
          <meta name="color-scheme" content="light dark"/>
          <link rel="manifest" href="/manifest.json"/>
          <link rel="icon" href="/favicon.ico"/>
          <meta name="theme-color" content="#5B8DEF"/>
          <meta name="description" content="آرمان‌ورزش - برنامه تمرین و تناسب اندام"/>
        
          <link rel="preload" href="/fonts/Yekan.ttf" as="font" crossOrigin="" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{__html: `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js');
  });
}`}} />
</body>
      </Html>
    );
  }
}
export default MyDocument;
