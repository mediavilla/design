import Head from 'next/head';
import { useRef } from 'react';
import GridText from '@/components/GridText';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useGridPanelObserver } from '@/lib/useGridPanelObserver';

/**
 * Renders the about page using measured text blocks so headings and copy stay on the site grid.
 */
export default function About() {
  const mainRef = useRef(null);

  useGridPanelObserver(mainRef);

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
      <main ref={mainRef}>
        <div className="grid-row grid-gap-y-1">
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="h2" variant="display-2">About</GridText>
          </div>
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="p" variant="body-1">
              I&apos;m spending a lot of time on the web playing with AI these days. See below for my work history.
            </GridText>
          </div>
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="h3" variant="section-1">Now</GridText>
            <ul>
              <li className="text-list-item">
                <GridText as="p" variant="body-1">
                  Head of Experience Design at <Link href="https://www.pwc.co.uk/services/consulting/the-experience-centre.html" target="_blank">PwC UK</Link>.
                </GridText>
              </li>
            </ul>
            <GridText as="h3" variant="section-1">Before</GridText>
            <ul>
              <li className="split-list-item">
                <GridText as="p" variant="micro-1">Dec/19 → Oct/20 (Contract)</GridText>
                <GridText as="p" variant="body-1">
                  Lead UX Designer at <a href="https://www.pwc.com/" target="_blank" rel="noreferrer">PwC</a>.
                </GridText>
              </li>
              <li className="split-list-item">
                <GridText as="p" variant="micro-1">Jul/17 → Nov/19 (Contract)</GridText>
                <GridText as="p" variant="body-1">
                  Service Design Manager at <a href="https://www.lloydsbank.com/help-guidance/managing-your-money/moneyworries.html" target="_blank" rel="noreferrer">Lloyds Banking Group</a>.
                </GridText>
              </li>
              <li className="split-list-item">
                <GridText as="p" variant="micro-1">Nov/16 → Jun/17 (Contract)</GridText>
                <GridText as="p" variant="body-1">
                  User Experience Director at <a href="https://www.rapp.com/" target="_blank" rel="noreferrer">RAPP</a>.
                </GridText>
              </li>
            </ul>
            <GridText as="h3" variant="section-1">More</GridText>
            <ul>
              <li className="text-list-item">
                <GridText as="p" variant="body-1">
                  During my 25+ years career I&apos;ve been lucky to work for some well known brands like Adidas, Airbnb, BP, Citibank, HP and PayPal.
                </GridText>
              </li>
            </ul>
          </div>
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="p" variant="body-1">
              You can find me on 💻 <a href="https://github.com/mediavilla" target="_blank" rel="noreferrer">Github</a> or 🦋 <a href="https://bsky.app/profile/mediavilla.bsky.social" target="_blank" rel="noreferrer">Bluesky</a>.
            </GridText>
          </div>
          <div className="grid-panel grid-start-1 grid-span-30">
            <GridText as="p" variant="body-1">And... yes, Mediavilla is actually my surname. 🤷🏽‍♂️</GridText>
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
