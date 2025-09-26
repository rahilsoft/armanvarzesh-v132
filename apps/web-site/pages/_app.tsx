import { registerServiceWorker } from '../lib/register-sw';
import type { AppProps } from 'next/app'
import '@arman/ui-tokens/styles/tokens.css'
import '../styles/globals.css'
import '@arman/ui-components/styles/components.css'

export default import { useEffect } from 'react';
function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <a className="skip-link" href="#main">پرش به محتوای اصلی</a>
    <style jsx global>{`
      .skip-link{position:absolute;left:-9999px;top:0;background:#000;color:#fff;padding:8px;border-radius:6px;z-index:9999}
      .skip-link:focus{left:8px;top:8px}
    `}</style>
<Component {...pageProps} />
}
