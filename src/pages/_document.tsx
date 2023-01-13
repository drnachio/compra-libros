/* eslint-disable react/no-danger */
import { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = (): JSX.Element => (
  <Html className="h-full bg-white">
    <Head>      
      <link rel="icon" type="image/x-icon" href="/fav.svg"/>
    </Head>
    <body className="h-full overflow-hidden">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
