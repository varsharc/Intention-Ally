import React from 'react';
import Head from 'next/head';

export default function TestPage() {
  return (
    <>
      <Head>
        <title>Test Page | Intention-Ally</title>
        <meta name="description" content="Test page for Intention-Ally" />
      </Head>
      
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Connection Test Page</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <div className="text-green-400">Frontend is running successfully! ✅</div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Test Buttons</h3>
            <div className="space-y-2">
              <button 
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                onClick={() => fetch('/api/health').then(res => res.json()).then(console.log).catch(console.error)}
              >
                Test API Health
              </button>
              
              <div className="ml-2 inline-block">
                <button 
                  className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 transition-colors"
                  onClick={() => fetch('/api/backend').then(res => res.json()).then(console.log).catch(console.error)}
                >
                  Test Backend Connection
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Environment</h3>
            <pre className="bg-gray-700 p-4 rounded overflow-x-auto">
              NODE_ENV: {process.env.NODE_ENV}<br />
              NEXT_PUBLIC_ENVIRONMENT: {process.env.NEXT_PUBLIC_ENVIRONMENT || 'Not set'}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}