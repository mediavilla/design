import Head from 'next/head';
import GridText from '@/components/GridText';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

/**
 * Renders the X callback page using the shared measured text primitives.
 */
export default function XCallbackPage() {
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
      <main>
        <div className="text-block">
          <GridText as="h2" variant="display">X-Callback</GridText>
        </div>
        <div className="text-block">
          <GridText as="p" variant="body">Just give me my credentials!</GridText>
        </div>
        <p><br/></p>
        <Footer showLink={true} />
      </main>
    </>
  );
}
