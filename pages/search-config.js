import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import SearchConfigForm from '../components/SearchConfig/SearchConfigForm';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

const SearchConfigPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { getDocuments, deleteDocument } = useFirestore('searchConfigs');
  const router = useRouter();
  
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Load user's search configurations
  useEffect(() => {
    const fetchConfigs = async () => {
      if (authLoading || !user) return;
      
      try {
        setLoading(true);
        const userConfigs = await getDocuments('userId', '==', user.uid);
        setConfigs(userConfigs);
      } catch (err) {
        console.error('Error fetching search configurations:', err);
        setError('Failed to load your search configurations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfigs();
  }, [user, authLoading, getDocuments]);
  
  // Handle edit configuration
  const handleEditConfig = (config) => {
    setSelectedConfig(config);
    setIsCreating(true);
  };
  
  // Handle create new configuration
  const handleCreateNew = () => {
    setSelectedConfig(null);
    setIsCreating(true);
  };
  
  // Handle delete configuration
  const handleDeleteConfig = async (id) => {
    if (window.confirm('Are you sure you want to delete this search configuration?')) {
      try {
        setIsDeleting(true);
        await deleteDocument(id);
        setConfigs(configs.filter(config => config.id !== id));
        console.log('Search configuration deleted successfully');
      } catch (err) {
        console.error('Error deleting search configuration:', err);
        console.error('Failed to delete search configuration');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Handle completion of form
  const handleFormComplete = () => {
    setIsCreating(false);
    // Reload the data
    if (user) {
      getDocuments('userId', '==', user.uid)
        .then(userConfigs => setConfigs(userConfigs))
        .catch(err => {
          console.error('Error refreshing search configurations:', err);
          setError('Failed to refresh your search configurations');
        });
    }
  };
  
  // Handle view results
  const handleViewResults = (configId) => {
    router.push(`/search-results?configId=${configId}`);
  };
  
  // If user not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">My Search Topics</h1>
          {!isCreating && (
            <button
              onClick={handleCreateNew}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md flex items-center"
              disabled={isDeleting}
            >
              <Plus size={18} className="mr-2" />
              New Search Topic
            </button>
          )}
        </div>
        
        {isCreating ? (
          <SearchConfigForm 
            existingConfig={selectedConfig} 
            onComplete={handleFormComplete} 
          />
        ) : (
          <>
            {loading ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">Loading your search configurations...</p>
              </div>
            ) : error ? (
              <div className="bg-gray-800 rounded-lg p-8 flex items-center justify-center">
                <AlertCircle size={24} className="text-red-500 mr-2" />
                <p className="text-red-500">{error}</p>
              </div>
            ) : configs.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">You don't have any search topics configured yet.</p>
                <button
                  onClick={handleCreateNew}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md inline-flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Create Your First Search Topic
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {configs.map(config => (
                  <div key={config.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-xl font-medium text-white mb-2">{config.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {config.keywords.slice(0, 3).map((keyword, i) => (
                          <span key={i} className="bg-gray-700 text-sm text-gray-300 px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                        {config.keywords.length > 3 && (
                          <span className="bg-gray-700 text-sm text-gray-300 px-2 py-1 rounded">
                            +{config.keywords.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Authority:</span>{' '}
                          <span className="text-white">{config.authorityThreshold}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Frequency:</span>{' '}
                          <span className="text-white">
                            {config.updateFrequency === 'daily' ? 'Daily' : 
                             config.updateFrequency === 'every3days' ? 'Every 3 days' : 
                             'Weekly'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Retention:</span>{' '}
                          <span className="text-white">
                            {config.dataRetention === 'indefinite' ? 'Indefinite' : `${config.dataRetention} days`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>{' '}
                          <span className={`${config.isActive ? 'text-green-500' : 'text-red-500'}`}>
                            {config.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex border-t border-gray-700 divide-x divide-gray-700">
                      <button 
                        className="flex-1 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                        onClick={() => handleViewResults(config.id)}
                      >
                        View Results
                      </button>
                      <button 
                        className="flex-1 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                        onClick={() => handleEditConfig(config)}
                        disabled={isDeleting}
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </button>
                      <button 
                        className="flex-1 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                        onClick={() => handleDeleteConfig(config.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchConfigPage;