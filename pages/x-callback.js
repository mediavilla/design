import Head from 'next/head';
import { useRef } from 'react';
import GridText from '@/components/GridText';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useGridPanelObserver } from '@/lib/useGridPanelObserver';

/**
 * Renders the X callback page using the shared measured text primitives.
 */
export default function XCallbackPage() {
  const mainRef = useRef(null);

  useGridPanelObserver(mainRef);

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>X-Callback - Mediavilla</title>
        <meta name="author" content="Juan Mediavilla" />
        <meta name="description" content="X callback page for Mediavilla." />
        <link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon" />
      </Head>
      <TopBar title="Juan Mediavilla" showTitleLink={true} />
      <main ref={mainRef}>
        <div className="grid-row grid-gap-y-1">
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="h2" variant="display-2">X-Callback</GridText>
          </div>
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="p" variant="body-1">Just give me my credentials!</GridText>
          </div>
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="p" variant="body-1"><br /></GridText>
          </div>
        </div>
        <Footer showLink={true} />
      </main>
    </>
  );
}
