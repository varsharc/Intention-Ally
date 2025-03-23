import React from 'react';
import { AppLayout } from '../components/ui-layout';
import { ResultSummary } from '../components/ui-results-list';
import { KnowledgeGraph } from '../components/ui-knowledge-graph';
import { ResultsList } from '../components/ui-results-list';

export default function Home() {
  return (
    <AppLayout>
      <ResultSummary />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <KnowledgeGraph />
        </div>
        <div className="col-span-1">
          <ResultsList />
        </div>
      </div>
    </AppLayout>
  );
}