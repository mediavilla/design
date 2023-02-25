import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Mediavilla</title>
        <meta name="author" content="Juan Mediavilla" />
        <meta name="description" content="User experience and service designer." />
        <meta name="keywords" content="user experience, service design, design" />
        <meta name="google-site-verification" content="NwnrJ5gez4yKFVJCou9JynAjMPrvM4gUB4YSaoToyhY" />


        <meta property="og:title" content="Juan Mediavilla" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="http://mediavilla.design/images/banner-logo.png" />
        <meta property="og:url" content="http://mediavilla.design/index.html" />
        <meta name="twitter:card" content="summary_large_image" />


        <meta property="og:description" content="User Experience and Service Designer" />
        <meta property="og:site_name" content="mediavilla.design" />
        <meta name="twitter:image:alt" content="Pattern with squares in diamond shape coloured in shades of grey with 5 diamonds arranged as a white M and 3 yellow diamons below arranged as a V in the center of the image. On the top left there are white, yellow and blue diamonds" />


        <meta name="twitter:site" content="@JuanMediavilla" />
        <link rel="shortcut icon" href="favicon.ico" type="image/vnd.microsoft.icon" />
        <link rel="stylesheet" href="https://use.typekit.net/ycy7yga.css" />
        <link rel="stylesheet" href="css/style.css" type="text/css" />
      </Head>
      <header>
        <h1>Juan Mediavilla</h1>
      </header>
      <main>
        <div className={"intro"}>
          <h2>User experience and service designer.</h2>
        </div>
        <div className={"cv"}>
          <h3>Now</h3>
          <ul>
            <li>Head of UX and Service Design at <Link href="https://www.pwc.co.uk/services/consulting/the-experience-centre.html" target="blank">PwC UK</Link>.</li>
          </ul>
          <h3>Before</h3>
          <ul>
            <li><span className={"code smallcopy"}>Dec/19 &#8594; Oct/20 (Contract):</span><br />Lead UX Designer at <Link href="https://www.pwc.com/" target="blank">PwC</Link>.</li>
            <li><span className={"code smallcopy"}>Jul/17 &#8594; Nov/19: (Contract)</span><br />Service Design Manager at <Link href="https://www.lloydsbank.com/help-guidance/managing-your-money/moneyworries.html" target="blank">Lloyds Banking Group</Link>.</li>
            <li><span className={"code smallcopy"}>Nov/16 &#8594; Jun/17: (Contract)</span><br />User Experience Director at <Link href="https://www.rapp.com/" target="blank">RAPP</Link>.</li>
          </ul>
          <h3>More</h3>
          <ul>
            <li>During my over 20 years career I've been lucky to work for some well known brands like Adidas, Airbnb, BP, Citibank, HP and PayPal.</li>
          </ul>
        </div>
        <div className={"contact"}>
          <p>You can find me on <Link href="https://www.linkedin.com/in/jrmediavilla/" target="blank">LinkedIn</Link> or <Link href="https://twitter.com/JuanMediavilla" target="blank">Twitter</Link>.</p>
        </div>
        <p>And... yes, Mediavilla is actually my surname.</p>
        <footer>
          <Image src="https://mediavilla.design/images/logo.svg" height="200" width="200" alt="logo" />
        </footer>
      </main>
    </>
  )
}
