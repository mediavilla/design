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
          <h2>About</h2>
        </div>
        <div>
          <p>I'm spending a lot of time on the web playing with AI these days. See below for my work history.</p>
        </div>
        <div>
          <h3>Now</h3>
          <ul>
            <li>Head of Experience Design at <Link href="https://www.pwc.co.uk/services/consulting/the-experience-centre.html" target="blank">PwC UK</Link>.</li>
          </ul>
          <h3>Before</h3>
          <ul>
            <li><span date>Dec/19 &#8594; Oct/20 (Contract):</span><br />Lead UX Designer at <a href="https://www.pwc.com/" target="blank">PwC</a>.</li>
            <li><span date>Jul/17 &#8594; Nov/19 (Contract):</span><br />Service Design Manager at <a href="https://www.lloydsbank.com/help-guidance/managing-your-money/moneyworries.html" target="blank">Lloyds Banking Group</a>.</li>
            <li><span date>Nov/16 &#8594; Jun/17 (Contract):</span><br />User Experience Director at <a href="https://www.rapp.com/" target="blank">RAPP</a>.</li>
          </ul>
          <h3>More</h3>
          <ul>
            <li>During my 25+ years career I&apos;ve been lucky to work for some well known brands like Adidas, Airbnb, BP, Citibank, HP and PayPal.</li>
          </ul>
        </div>
        <div>
          <p>You can find me on 💻 <a href="https://github.com/mediavilla" target="blank">Github</a> or 🦋 <a href="https://bsky.app/profile/mediavilla.bsky.social" target="blank">Bluesky</a>.</p>
        </div>
        <p>And... yes, Mediavilla is actually my surname. 🤷🏽‍♂️</p>
        <p><br/></p>
        <Footer showLink={true} />
      </main>
    </>
  );
}

