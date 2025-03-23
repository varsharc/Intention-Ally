import React from 'react';
import Head from 'next/head';
import { styles, combineStyles } from '../styles/app-styles';
import { TrendVisualizationPanel } from '../components/ui-trend-visualization';
import { KnowledgeGraphPanel } from '../components/ui-knowledge-graph';
import FirebaseTest from '../components/FirebaseTest';

export default function TestPage() {
  return (
    <>
      <Head>
        <title>Test Page | Intention-Ally</title>
        <meta name="description" content="Test page for Intention-Ally" />
      </Head>
      
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#EAB308]">Intention-Ally Component Test</h1>
        
        <div className="bg-[#111827] p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <div className="text-green-400">Frontend is running successfully! ✅</div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Test Buttons</h3>
            <div className="space-y-2">
              <button 
                className="px-4 py-2 bg-[#EAB308] text-black rounded hover:bg-[#CA8A04] transition-colors"
                onClick={() => fetch('/api/health').then(res => res.json()).then(console.log).catch(console.error)}
              >
                Test API Health
              </button>
              
              <div className="ml-2 inline-block">
                <button 
                  className="px-4 py-2 bg-[#374151] text-white rounded hover:bg-[#4B5563] transition-colors"
                  onClick={() => fetch('/api/backend').then(res => res.json()).then(console.log).catch(console.error)}
                >
                  Test Backend Connection
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Firebase Connection Test */}
        <FirebaseTest />
        
        {/* UI Component Tests */}
        <h2 className="text-2xl font-bold mb-4 text-[#F9FAFB]">UI Component Tests</h2>
        
        <div className={combineStyles(styles.grid.twoColumn, "mb-8")}>
          <KnowledgeGraphPanel />
          <TrendVisualizationPanel />
        </div>
        
        <div className="mt-6 bg-[#111827] p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Environment</h3>
          <pre className="bg-[#1F2937] p-4 rounded overflow-x-auto text-[#D1D5DB]">
            NODE_ENV: {process.env.NODE_ENV}<br />
            NEXT_PUBLIC_ENVIRONMENT: {process.env.NEXT_PUBLIC_ENVIRONMENT || 'Not set'}
          </pre>
        </div>
      </div>
    </>
  );
}