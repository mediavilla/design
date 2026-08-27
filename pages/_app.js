import { useEffect } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelLine } from 'geist/font/pixel';
import '@/styles/globals.css'

const geistVariableClasses = [
  GeistSans.variable,
  GeistMono.variable,
  GeistPixelSquare.variable,
  GeistPixelGrid.variable,
  GeistPixelCircle.variable,
  GeistPixelLine.variable,
].filter(Boolean);

const geistVariableClassName = geistVariableClasses.join(' ');

/**
 * Mounts global theme and font variable classes before rendering each route.
 */
export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.classList.add(...geistVariableClasses);

    return () => {
      document.documentElement.classList.remove(...geistVariableClasses);
    };
  }, []);

  return (
    <div className={geistVariableClassName}>
      <Component {...pageProps} />
    </div>
  );
}
