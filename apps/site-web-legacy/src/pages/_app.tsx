import type { AppProps } from 'next/app';
import ErrorBoundary from '../../../packages/ui/components/ErrorBoundary';
import '../../../packages/observability/patchFetch';
export default function MyApp({ Component, pageProps }: AppProps){
  return <ErrorBoundary><Component {...pageProps} /></ErrorBoundary>;
}
