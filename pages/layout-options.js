import { useRef } from 'react';
import Head from 'next/head';
import BackgroundGridCanvas from '@/components/BackgroundGridCanvas';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import GridText from '@/components/GridText';
import {
  HeroBannerLayout,
  TwoColumnMediaLayout,
  ThreeColumnMediaLayout,
  FourColumnMediaLayout,
} from '@/components/GridLayoutOptions';
import { useGridPanelObserver } from '@/lib/useGridPanelObserver';

/**
 * Dummy page that showcases reusable grid layout options.
 */
export default function LayoutOptionsPage() {
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  useGridPanelObserver(contentRef);

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Layout Options - Mediavilla</title>
        <meta name="description" content="Reusable dummy layouts aligned to the grid." />
        <link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon" />
      </Head>

      <div className="page-canvas-shell">
        <BackgroundGridCanvas contentRef={contentRef} footerRef={footerRef} />
        <div ref={contentRef} className="page-canvas-content">
          <TopBar title="Juan Mediavilla" showTitleLink={true} />
          <main>
            <div className="grid-row grid-gap-y-2">
              <div className="grid-panel grid-container">
                <HeroBannerLayout />
              </div>

              <div className="grid-panel grid-container">
                <TwoColumnMediaLayout />
              </div>

              <div className="grid-panel grid-container">
                <ThreeColumnMediaLayout />
              </div>

              <div className="grid-panel grid-container">
                <FourColumnMediaLayout />
              </div>
            </div>
            <Footer ref={footerRef} showLink={false} />
          </main>
        </div>
      </div>
    </>
  );
}
