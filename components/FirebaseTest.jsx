import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

/**
 * Firebase connectivity test component
 * This component verifies the connection to Firebase
 */
const FirebaseTest = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [envVars, setEnvVars] = useState([]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        
        // Check if Firebase environment variables are set
        const requiredVars = [
          'NEXT_PUBLIC_FIREBASE_API_KEY',
          'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
          'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
          'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
          'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
          'NEXT_PUBLIC_FIREBASE_APP_ID'
        ];
        
        const envCheck = requiredVars.map(varName => {
          const isSet = process.env[varName] !== undefined;
          return { name: varName, isSet };
        });
        
        setEnvVars(envCheck);
        
        // If all required variables are set, try to initialize Firebase
        const allVarsSet = envCheck.every(v => v.isSet);
        
        if (allVarsSet) {
          // Import Firebase dynamically to avoid SSR issues
          const { initFirebase } = await import('../services/firebase');
          const db = initFirebase();
          
          if (db) {
            setIsConnected(true);
          } else {
            setIsConnected(false);
            setError("Failed to initialize Firebase");
          }
        } else {
          setIsConnected(false);
          setError("Missing required Firebase environment variables");
        }
      } catch (err) {
        console.error("Firebase connection test failed:", err);
        setIsConnected(false);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md p-4 text-sm">
      <h3 className="text-white font-medium mb-3 flex items-center">
        <div className="w-2 h-2 rounded-full mr-2 bg-gray-500" />
        Firebase Connection Test
      </h3>
      
      {isLoading ? (
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          <span>Testing connection...</span>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center">
            <span className="mr-2">Connection Status:</span>
            {isConnected === null ? (
              <span className="text-gray-400">Unknown</span>
            ) : isConnected ? (
              <span className="text-green-500 flex items-center">
                <Check size={16} className="mr-1" /> Connected
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <X size={16} className="mr-1" /> Failed
              </span>
            )}
          </div>
          
          {error && (
            <div className="mb-3 text-red-400 bg-red-900 bg-opacity-20 p-2 rounded flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-gray-300 mb-1">Environment Variables:</h4>
            <ul className="space-y-1">
              {envVars.map((variable) => (
                <li key={variable.name} className="flex items-center">
                  {variable.isSet ? (
                    <Check size={14} className="text-green-500 mr-2" />
                  ) : (
                    <X size={14} className="text-red-500 mr-2" />
                  )}
                  <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">{variable.name}</code>
                  <span className="ml-2 text-gray-400">
                    {variable.isSet ? "Set" : "Not set"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {!isConnected && (
            <div className="mt-3 p-2 border border-dashed border-gray-700 rounded text-xs text-gray-400">
              <p>Troubleshooting tips:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Verify all Firebase environment variables are set correctly</li>
                <li>Check that Firebase project permissions are configured properly</li>
                <li>Ensure Firestore database has been created in your Firebase project</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;