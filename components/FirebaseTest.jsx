import React, { useState, useEffect } from 'react';
import { 
  initFirebase, 
  isFirebaseConnected, 
  getStorageMetrics, 
  getKeywordStats 
} from '../services/firebase';

/**
 * Enhanced Firebase Component
 * This displays the Firebase connection status and storage metrics
 */
const FirebaseTest = () => {
  const [status, setStatus] = useState('Initializing Firebase...');
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({});
  const [metrics, setMetrics] = useState(null);
  const [keywordStats, setKeywordStats] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
        setLoading(true);
        
        // Collect environment variables for debugging (without exposing values)
        const envVars = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing',
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
        };
        
        setConfig(envVars);
        
        // Try to initialize Firebase
        const db = initFirebase();
        
        if (db && isFirebaseConnected()) {
          setStatus('Firebase successfully initialized! ✅');
          
          // Get storage metrics
          const storageMetrics = await getStorageMetrics();
          setMetrics(storageMetrics);
          
          // Get keyword stats
          const stats = await getKeywordStats();
          setKeywordStats(stats);
        } else {
          throw new Error('Failed to initialize Firebase');
        }
      } catch (err) {
        console.error('Firebase initialization error:', err);
        setError(err.message);
        setStatus('Firebase initialization failed ❌');
      } finally {
        setLoading(false);
      }
    };

    testFirebaseConnection();
  }, []);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  return (
    <div className="p-4 bg-[#1F2937] rounded-lg mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-[#F9FAFB]">Firebase Data Storage</h2>
        <button 
          onClick={() => setShowDetails(!showDetails)} 
          className="text-sm px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div className={`px-4 py-2 rounded mb-3 ${error ? 'bg-red-500 bg-opacity-20 text-red-400' : 'bg-green-500 bg-opacity-20 text-green-400'}`}>
        {status}
      </div>
      
      {!error && !loading && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-1">Total Sessions</h3>
            <p className="text-2xl font-bold text-yellow-500">{metrics.totalSessions}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-1">Tracked Keywords</h3>
            <p className="text-2xl font-bold text-yellow-500">{metrics.totalKeywords}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-1">Storage Since</h3>
            <p className="text-xl font-bold text-yellow-500">
              {metrics.oldestSession ? formatDate(metrics.oldestSession).split(' ')[0] : 'N/A'}
            </p>
          </div>
        </div>
      )}
      
      {/* Optimization Features */}
      {!error && !loading && (
        <div className="bg-gray-800 p-3 rounded-lg mb-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Storage Optimization Features</h3>
          <ul className="text-xs space-y-1.5 text-gray-400">
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Automatic cleanup of old search sessions (limit: 50 per keyword)
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Description truncation to reduce storage needs
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Keyword statistics aggregation for trend analysis
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Batch operations for efficient data updates
            </li>
          </ul>
        </div>
      )}
      
      {/* Detailed Information (collapsed by default) */}
      {showDetails && (
        <>
          <div className="mt-3 text-sm text-[#D1D5DB]">
            <h3 className="font-medium border-b border-gray-700 pb-1 mb-2">Environment Variables:</h3>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {Object.entries(config).map(([key, value]) => (
                <li key={key} className={value.includes('✓') ? 'text-green-400' : 'text-red-400'}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
          
          {!error && !loading && keywordStats.length > 0 && (
            <div className="mt-4 text-sm text-[#D1D5DB]">
              <h3 className="font-medium border-b border-gray-700 pb-1 mb-2">Keyword Statistics:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-2 py-1 text-left">Keyword</th>
                      <th className="px-2 py-1 text-center">Searches</th>
                      <th className="px-2 py-1 text-center">Results</th>
                      <th className="px-2 py-1 text-center">Last Searched</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordStats.slice(0, 5).map((stat, index) => (
                      <tr key={stat.keyword} className={index % 2 === 0 ? 'bg-gray-800 bg-opacity-50' : ''}>
                        <td className="px-2 py-1">{stat.keyword}</td>
                        <td className="px-2 py-1 text-center">{stat.searchCount}</td>
                        <td className="px-2 py-1 text-center">{stat.totalResults}</td>
                        <td className="px-2 py-1 text-center">{formatDate(stat.lastSearched)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {keywordStats.length > 5 && (
                <div className="mt-1 text-xs text-gray-400 text-right">
                  Showing 5 of {keywordStats.length} keywords. See Analytics for full details.
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {error && (
        <div className="mt-3 text-sm text-[#D1D5DB]">
          <div>Error: {error}</div>
          <div className="mt-2">
            <strong>Troubleshooting:</strong>
            <ul className="list-disc list-inside mt-1">
              <li>Check that all Firebase environment variables are set correctly</li>
              <li>Verify that your Firebase project is properly set up</li>
              <li>Check for Firebase project restrictions (CORS, IP restrictions, etc.)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;