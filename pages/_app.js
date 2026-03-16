import { useEffect } from 'react';
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
