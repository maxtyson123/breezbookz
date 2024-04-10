import Head from 'next/head';

import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Breez Bookz</title>
      <meta name="test" content="set PATH=%PATH%;C:\Users\max.tyson\Downloads\node-v21.6.1-win-x64" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/BB.png" />
      <link rel="preconnect" href="https://stijndv.com" />
      <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
    </Head>
    <Component {...pageProps} />
  </>
);

export default MyApp;
