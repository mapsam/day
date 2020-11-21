import '../styles/styles.sass'
import Layout from '../components/Layout.js';
import { Provider } from 'next-auth/client'
import Head from 'next/head';
// https://github.com/nextauthjs/next-auth/issues/833
import 'reflect-metadata';

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <title>Day</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
