import Document, { Html, Head, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  render(){
    return (
      <Html lang="fa" dir="rtl">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
          <meta name="theme-color" content="#111111" />
          <meta name="color-scheme" content="light dark" />
          <link rel="preload" as="image" href="/hero.jpg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
