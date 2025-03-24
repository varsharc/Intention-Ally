import '../styles/globals.css';
import { FirebaseProvider } from '../contexts/FirebaseContext';
import { ThemeProvider } from '../components/ThemeProvider';
import Head from 'next/head';

/**
 * Custom Next.js App component that wraps the entire application
 * Provides global context providers for Firebase and theme
 */
function MyApp({ Component, pageProps }) {
  return (
    <FirebaseProvider>
      <ThemeProvider>
        <Head>
          <title>Intention-Ally | Semantic Search & Knowledge Visualization</title>
          <meta name="description" content="Discover high-quality information with semantic search and interactive knowledge visualization." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </FirebaseProvider>
  );
}

export default MyApp;
