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

const HERO_WORDS = ['HEY', 'HOLA', 'WELCOME','HELLO', "HI"];

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
        <title>Mediavilla</title>
        <meta name="author" content="Juan Mediavilla" />
        <meta name="description" content="User experience and service designer." />
        <meta name="keywords" content="user experience, service design, design" />
        <meta name="google-site-verification" content="NwnrJ5gez4yKFVJCou9JynAjMPrvM4gUB4YSaoToyhY" />


        <meta property="og:title" content="Juan Mediavilla" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://mediavilla.design/banner-logo.png" />
        <meta property="og:url" content="http://mediavilla.design/index.html" />
        <meta name="twitter:card" content="summary_large_image" />


        <meta property="og:description" content="User Experience and Service Designer" />
        <meta property="og:site_name" content="mediavilla.design" />
        <meta name="twitter:image:alt" content="Pattern with squares in diamond shape coloured in shades of grey with 5 diamonds arranged as a white M and 3 yellow diamons below arranged as a V in the center of the image. On the top left there are white, yellow and blue diamonds" />


        <meta name="twitter:site" content="@JuanMediavilla" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/vnd.microsoft.icon" />
        <link rel="apple-touch-icon" href="https://mediavilla.design/mediavillalogo.png"></link>

        </Head>

      <div className="page-canvas-shell">
        <BackgroundGridCanvas contentRef={contentRef} footerRef={footerRef} />
        <div ref={contentRef} className="page-canvas-content">
          <TopBar title="Juan Mediavilla" showTitleLink={true} />
          <main>
            <div className="grid-row grid-gap-y-2">
              <div className="grid-panel grid-container">
              <HeroBannerLayout
                titleWords={HERO_WORDS}
                titleVariant="dotmatrix-7"
                copyVariant="geistPixelSquare-1"
                copy={
                  <>
                    Thanks for visiting my website!
                    <br /><br />
                    This is my personal playground on the internet.
                    <br /><br />
                    I'm currently Head of UX and Service design at PwC UK.
                    <br /><br />
                    In my free time I'm building games for iOS and online tools experimenting with AI.
                    <br /><br />
                    More updates soon...
                  </>
                }
              />
              </div>
            </div>
            <Footer ref={footerRef} showLink={false} />
          </main>
        </div>
      </div>
    </>
  );
}
