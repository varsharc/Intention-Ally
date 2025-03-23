import React from 'react';
import { 
  MainLayout, 
  SearchPageLayout, 
  KnowledgeGraph, 
  ResultsList, 
  ResultSummary 
} from '../../components';

export default function SearchPage() {
  return (
    <MainLayout activePage="search">
      <SearchPageLayout>
        <div className="grid grid-cols-5 gap-6">
          {/* Left Column (3/5) - Knowledge Graph */}
          <div className="col-span-3">
            {/* Result Summary Row */}
            <ResultSummary />
            
            {/* Knowledge Graph */}
            <div className="h-96">
              <KnowledgeGraph />
            </div>
          </div>
          
          {/* Right Column (2/5) - Results List */}
          <div className="col-span-2">
            <ResultsList />
          </div>
        </div>
      </SearchPageLayout>
    </MainLayout>
  );
}