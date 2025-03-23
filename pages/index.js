import React from 'react';
import Head from 'next/head';
import { SearchPageLayout } from '../components/ui-layout';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Intention-Ally | Semantic Search & Clustering Tool</title>
        <meta name="description" content="A semantic search and clustering tool with knowledge graph visualization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchPageLayout />
    </div>
  );
}