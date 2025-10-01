import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '@/styles/Home.module.css'
import Typewriter from '../components/Typewriter'

export default function Home() {

  const actions = [
    { type: 'delay', ms: 10000 },
    { type: 'type', text: 'Designer' },
    { type: 'delay', ms: 200 },
    { type: 'delete', chars: 2 }
  ];

  return (
    <>
      <Head>
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

      </Head>
      <header>
        <h1>Juan Mediavilla</h1>
      </header>
      <main>
        <div className={styles.intro}>
          <Typewriter actions={actions} />

        </div>

        <div className={styles.cv}>
          <h3>Now</h3>
          <ul>
            <li>Head of UX and Service Design at <Link href="#" target="blank">PwC UK</Link>.</li>
          </ul>
          <h3>Before</h3>
          <ul>
            <li><span className={styles.codeSmallCopy}>Dec/19 &#8594; Oct/20 (Contract):</span><br />Lead UX Designer at <Link href="https://www.pwc.com/" target="blank">PwC</Link>.</li>
            <li><span className={styles.codeSmallCopy}>Jul/17 &#8594; Nov/19 (Contract):</span><br />Service Design Manager at <Link href="https://www.lloydsbank.com/help-guidance/managing-your-money/moneyworries.html" target="blank">Lloyds Banking Group</Link>.</li>
            <li><span className={styles.codeSmallCopy}>Nov/16 &#8594; Jun/17 (Contract):</span><br />User Experience Director at <Link href="https://www.rapp.com/" target="blank">RAPP</Link>.</li>
          </ul>
          <h3>More</h3>
          <ul>
            <li>During my 25+ years career I&apos;ve been lucky to work for some well known brands like Adidas, Airbnb, BP, Citibank, HP and PayPal.</li>
          </ul>
        </div>
        <div className={styles.contact}>
          <p>You can find me on 💻 <Link href="https://github.com/mediavilla" target="blank">Github</Link>, 🐦 <Link href="https://twitter.com/JuanMediavilla" target="blank">Twitter</Link> or 👔 <Link href="https://www.linkedin.com/in/jrmediavilla/" target="blank">LinkedIn</Link>.</p>
        </div>
        <p>And... yes, Mediavilla is actually my surname. 🤷🏽‍♂️</p>
        <footer>
          <Image src="./logo.svg" height="200" width="200" alt="logo" />
        </footer>
      </main>
    </>
  )
}
