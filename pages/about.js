import Head from 'next/head';
import GridText from '@/components/GridText';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

/**
 * Renders the about page using measured text blocks so headings and copy stay on the site grid.
 */
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
        <div className="text-block">
          <GridText as="h2" variant="display">About</GridText>
        </div>
        <div className="text-block">
          <GridText as="p" variant="body">
            I&apos;m spending a lot of time on the web playing with AI these days. See below for my work history.
          </GridText>
        </div>
        <div>
          <GridText as="h3" variant="section">Now</GridText>
          <ul>
            <li className="text-list-item">
              <GridText as="p" variant="body">
                Head of Experience Design at <Link href="https://www.pwc.co.uk/services/consulting/the-experience-centre.html" target="_blank">PwC UK</Link>.
              </GridText>
            </li>
          </ul>
          <GridText as="h3" variant="section">Before</GridText>
          <ul>
            <li className="split-list-item">
              <GridText as="p" variant="micro">Dec/19 → Oct/20 (Contract)</GridText>
              <GridText as="p" variant="body">
                Lead UX Designer at <a href="https://www.pwc.com/" target="_blank" rel="noreferrer">PwC</a>.
              </GridText>
            </li>
            <li className="split-list-item">
              <GridText as="p" variant="micro">Jul/17 → Nov/19 (Contract)</GridText>
              <GridText as="p" variant="body">
                Service Design Manager at <a href="https://www.lloydsbank.com/help-guidance/managing-your-money/moneyworries.html" target="_blank" rel="noreferrer">Lloyds Banking Group</a>.
              </GridText>
            </li>
            <li className="split-list-item">
              <GridText as="p" variant="micro">Nov/16 → Jun/17 (Contract)</GridText>
              <GridText as="p" variant="body">
                User Experience Director at <a href="https://www.rapp.com/" target="_blank" rel="noreferrer">RAPP</a>.
              </GridText>
            </li>
          </ul>
          <GridText as="h3" variant="section">More</GridText>
          <ul>
            <li className="text-list-item">
              <GridText as="p" variant="body">
                During my 25+ years career I&apos;ve been lucky to work for some well known brands like Adidas, Airbnb, BP, Citibank, HP and PayPal.
              </GridText>
            </li>
          </ul>
        </div>
        <div className="text-block">
          <GridText as="p" variant="body">
            You can find me on 💻 <a href="https://github.com/mediavilla" target="_blank" rel="noreferrer">Github</a> or 🦋 <a href="https://bsky.app/profile/mediavilla.bsky.social" target="_blank" rel="noreferrer">Bluesky</a>.
          </GridText>
        </div>
        <GridText as="p" variant="body">And... yes, Mediavilla is actually my surname. 🤷🏽‍♂️</GridText>
        <p><br/></p>
        <Footer showLink={true} />
      </main>
    </>
  );
}
