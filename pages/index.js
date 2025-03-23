import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Home page redirects to search
export default function Home() {
  const router = useRouter();
  
  // Redirect to search page on component mount
  useEffect(() => {
    router.push('/search');
  }, []);

  return (
    <div>
      <Head>
        <title>Intention-Ally | Semantic Search & Clustering Tool</title>
        <meta name="description" content="A semantic search and clustering tool with knowledge graph visualization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">Intention-Ally</h1>
          <p className="text-lg text-gray-300">Redirecting to search...</p>
        </div>
      </div>
    </div>
  );
}