// app/hooks/useSearchConfig.ts
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { searchConfigService } from '@/lib/firestoreService';
import { SearchConfig } from '@/types/database.types';

export function useSearchConfigs() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<SearchConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfigs() {
      if (!user) {
        setConfigs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userConfigs = await searchConfigService.getUserConfigs(user.uid);
        setConfigs(userConfigs);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching search configs:', err);
        setError(err.message || 'Failed to load search configurations');
      } finally {
        setLoading(false);
      }
    }

    fetchConfigs();
  }, [user]);

  const createConfig = async (config: Omit<SearchConfig, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      throw new Error('You must be logged in to create a search configuration');
    }

    try {
      const newConfig: Omit<SearchConfig, 'id'> = {
        ...config,
        userId: user.uid,
        createdAt: new Date(),
      };

      const configId = await searchConfigService.createSearchConfig(newConfig);
      
      // Refetch configs to update the list
      const updatedConfigs = await searchConfigService.getUserConfigs(user.uid);
      setConfigs(updatedConfigs);
      
      return configId;
    } catch (err: any) {
      console.error('Error creating search config:', err);
      setError(err.message || 'Failed to create search configuration');
      throw err;
    }
  };

  const updateConfig = async (configId: string, data: Partial<SearchConfig>) => {
    if (!user) {
      throw new Error('You must be logged in to update a search configuration');
    }

    try {
      await searchConfigService.updateSearchConfig(configId, data);
      
      // Update local state
      setConfigs(prev => 
        prev.map(config => 
          config.id === configId ? { ...config, ...data } : config
        )
      );
    } catch (err: any) {
      console.error('Error updating search config:', err);
      setError(err.message || 'Failed to update search configuration');
      throw err;
    }
  };

  const deleteConfig = async (configId: string) => {
    if (!user) {
      throw new Error('You must be logged in to delete a search configuration');
    }

    try {
      await searchConfigService.deleteSearchConfig(configId);
      
      // Update local state
      setConfigs(prev => prev.filter(config => config.id !== configId));
    } catch (err: any) {
      console.error('Error deleting search config:', err);
      setError(err.message || 'Failed to delete search configuration');
      throw err;
    }
  };

  return {
    configs,
    loading,
    error,
    createConfig,
    updateConfig,
    deleteConfig,
  };
}

export function useSearchConfig(configId: string | null) {
  const { user } = useAuth();
  const [config, setConfig] = useState<SearchConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      if (!user || !configId) {
        setConfig(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const searchConfig = await searchConfigService.getSearchConfig(configId);
        
        // Verify ownership
        if (searchConfig && searchConfig.userId !== user.uid) {
          setError('You do not have permission to access this search configuration');
          setConfig(null);
        } else {
          setConfig(searchConfig);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching search config:', err);
        setError(err.message || 'Failed to load search configuration');
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [user, configId]);

  const updateConfig = async (data: Partial<SearchConfig>) => {
    if (!user || !configId) {
      throw new Error('You must be logged in and have a valid configuration to update');
    }

    try {
      await searchConfigService.updateSearchConfig(configId, data);
      
      // Update local state
      setConfig(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      console.error('Error updating search config:', err);
      setError(err.message || 'Failed to update search configuration');
      throw err;
    }
  };

  return {
    config,
    loading,
    error,
    updateConfig,
  };
}