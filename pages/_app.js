import '@/styles/globals.css'
import { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
