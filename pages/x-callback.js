import Head from 'next/head';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>About - Mediavilla</title>
        <meta name="author" content="Juan Mediavilla" />
        <meta name="description" content="About Juan Mediavilla - User experience and service designer." />
        <link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon" />
      </Head>
      <TopBar title="Juan Mediavilla" showTitleLink={true} />
      <main>
        <div>
          <h2>X-Callback</h2>
        </div>
        <div>
          <p>Just give me my credentials!</p>
        </div>
        <p><br/></p>
        <Footer showLink={true} />
      </main>
    </>
  );
}

