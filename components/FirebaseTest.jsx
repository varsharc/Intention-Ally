import React, { useState, useEffect } from 'react';
import { initFirebase } from '../services/firebase';

/**
 * Test component for Firebase connection
 * This displays the Firebase connection status
 */
const FirebaseTest = () => {
  const [status, setStatus] = useState('Initializing Firebase...');
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({});

  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
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
        
        if (db) {
          setStatus('Firebase successfully initialized! ✅');
        } else {
          throw new Error('Failed to initialize Firebase');
        }
      } catch (err) {
        console.error('Firebase initialization error:', err);
        setError(err.message);
        setStatus('Firebase initialization failed ❌');
      }
    };

    testFirebaseConnection();
  }, []);

  return (
    <div className="p-4 bg-[#1F2937] rounded-lg mb-4">
      <h2 className="text-lg font-medium text-[#F9FAFB] mb-2">Firebase Connection Test</h2>
      <div className={`px-4 py-2 rounded ${error ? 'bg-red-500 bg-opacity-20 text-red-400' : 'bg-green-500 bg-opacity-20 text-green-400'}`}>
        {status}
      </div>
      
      <div className="mt-3 text-sm text-[#D1D5DB]">
        <h3 className="font-medium">Environment Variables Status:</h3>
        <ul className="list-disc list-inside mt-1 space-y-1">
          {Object.entries(config).map(([key, value]) => (
            <li key={key} className={value.includes('✓') ? 'text-green-400' : 'text-red-400'}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>
      
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