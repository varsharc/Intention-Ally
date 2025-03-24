// app/(pages)/search/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sliders, Info, X, Plus } from 'lucide-react';
import { useSearchConfigs } from '@/app/hooks/useSearchConfig';
import { SearchConfig } from '@/types/database.types';

export default function NewSearchPage() {
  const router = useRouter();
  const { createConfig } = useSearchConfigs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [templates, setTemplates] = useState({
    regulatory: true,
    academic: true,
    technology: false,
    market: true,
  });
  const [authorityThreshold, setAuthorityThreshold] = useState(75);
  const [updateFrequency, setUpdateFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dataRetention, setDataRetention] = useState('30');
  const [deepSearch, setDeepSearch] = useState(false);
  const [recencyWindow, setRecencyWindow] = useState('30 days');
  
  // Advanced settings state
  const [trustedDomains, setTrustedDomains] = useState<string[]>([]);
  const [excludedDomains, setExcludedDomains] = useState<string[]>([]);
  const [trustedDomainInput, setTrustedDomainInput] = useState('');
  const [excludedDomainInput, setExcludedDomainInput] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      setError('Topic name is required');
      return;
    }
    
    if (keywords.length === 0) {
      setError('At least one keyword is required');
      return;
    }
    
    // Get selected templates
    const selectedTemplates = Object.entries(templates)
      .filter(([_, isSelected]) => isSelected)
      .map(([template]) => template);
    
    if (selectedTemplates.length === 0) {
      setError('At least one domain template must be selected');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create search configuration
      const configData: Omit<SearchConfig, 'id' | 'userId' | 'createdAt'> = {
        name,
        keywords,
        templateType: selectedTemplates.join(','),
        authorityThreshold,
        updateFrequency,
        isActive: true,
        advancedParams: {
          trustedDomains,
          excludedDomains,
          recencyWindow,
          useDeepSearch: deepSearch,
          dataRetentionDays: parseInt(dataRetention, 10),
        }
      };
      
      const configId = await createConfig(configData);
      
      // Navigate to the search results page
      router.push(`/search/${configId}`);
    } catch (err: any) {
      console.error('Error creating search config:', err);
      setError(err.message || 'Failed to create search configuration');
    } finally {
      setLoading(false);
    }
  };

  // Add keyword
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  // Remove keyword
  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  // Add trusted domain
  const addTrustedDomain = () => {
    if (trustedDomainInput.trim() && !trustedDomains.includes(trustedDomainInput.trim())) {
      setTrustedDomains([...trustedDomains, trustedDomainInput.trim()]);
      setTrustedDomainInput('');
    }
  };

  // Remove trusted domain
  const removeTrustedDomain = (domain: string) => {
    setTrustedDomains(trustedDomains.filter(d => d !== domain));
  };

  // Add excluded domain
  const addExcludedDomain = () => {
    if (excludedDomainInput.trim() && !excludedDomains.includes(excludedDomainInput.trim())) {
      setExcludedDomains([...excludedDomains, excludedDomainInput.trim()]);
      setExcludedDomainInput('');
    }
  };

  // Remove excluded domain
  const removeExcludedDomain = (domain: string) => {
    setExcludedDomains(excludedDomains.filter(d => d !== domain));
  };

  // Handle keyword input key press (Enter to add)
  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Create New Search Topic</h1>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Search Configuration</h2>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-yellow-500 hover:text-yellow-400"
          >
            <Sliders size={16} className="mr-1" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Parameters</span>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/30 text-red-400 p-3 mb-4 rounded border border-red-800">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Topic Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
              placeholder="e.g., EU Textile Regulations"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Keywords</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((keyword) => (
                <span key={keyword} className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center">
                  {keyword}
                  <button 
                    type="button"
                    onClick={() => removeKeyword(keyword)} 
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input 
                type="text" 
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-l-md px-3 py-2 text-white"
                placeholder="Add a keyword or phrase..."
              />
              <button
                type="button"
                onClick={addKeyword}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-r-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">Domain Templates</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={templates.regulatory}
                    onChange={(e) => setTemplates({...templates, regulatory: e.target.checked})}
                    className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  />
                  <span className="text-sm text-white">Regulatory</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={templates.academic}
                    onChange={(e) => setTemplates({...templates, academic: e.target.checked})}
                    className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  />
                  <span className="text-sm text-white">Academic</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={templates.technology}
                    onChange={(e) => setTemplates({...templates, technology: e.target.checked})}
                    className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  />
                  <span className="text-sm text-white">Technology</span>
                </label>
                <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={templates.market}
                    onChange={(e) => setTemplates({...templates, market: e.target.checked})}
                    className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  />
                  <span className="text-sm text-white">Market</span>
                </label>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-400 mr-2">Authority Threshold</label>
                  <div className="relative group">
                    <Info size={16} className="text-gray-500 hover:text-white cursor-help" />
                    <div className="absolute hidden group-hover:block bg-black border border-gray-700 p-2 rounded text-xs w-64 -mt-1 ml-6 z-10">
                      Higher values prioritize established sources like academic and government sites. Lower values include a broader range of sources.
                    </div>
                  </div>
                </div>
                <span className="text-sm text-yellow-500">{authorityThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={authorityThreshold}
                onChange={(e) => setAuthorityThreshold(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Broader</span>
                <span>Stricter</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Update Frequency</label>
              <select 
                value={updateFrequency}
                onChange={(e) => setUpdateFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Data Retention</label>
              <select 
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
          </div>
          
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-750 rounded-lg border border-gray-700">
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <input 
                    type="checkbox" 
                    checked={deepSearch}
                    onChange={(e) => setDeepSearch(e.target.checked)}
                    className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500 mr-2" 
                  />
                  Enable Deep Search with Claude AI
                </label>
                <p className="text-xs text-gray-500">Uses Claude AI to perform deeper research and analysis (uses more resources)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recency Window</label>
                <select 
                  value={recencyWindow}
                  onChange={(e) => setRecencyWindow(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="7 days">Last 7 days</option>
                  <option value="30 days">Last 30 days</option>
                  <option value="90 days">Last 90 days</option>
                  <option value="1 year">Last year</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Trusted Domains</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {trustedDomains.map((domain) => (
                    <span key={domain} className="bg-green-900/30 text-green-400 border border-green-800 px-2 py-1 rounded text-sm flex items-center">
                      {domain}
                      <button 
                        type="button"
                        onClick={() => removeTrustedDomain(domain)} 
                        className="ml-2 text-green-600 hover:text-green-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {trustedDomains.length === 0 && (
                    <span className="text-xs text-gray-500">No trusted domains added</span>
                  )}
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    value={trustedDomainInput}
                    onChange={(e) => setTrustedDomainInput(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-l-md px-3 py-2 text-white"
                    placeholder="e.g., example.gov, .edu"
                  />
                  <button
                    type="button"
                    onClick={addTrustedDomain}
                    className="bg-green-800 hover:bg-green-700 text-white px-3 py-2 rounded-r-md"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Excluded Domains</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {excludedDomains.map((domain) => (
                    <span key={domain} className="bg-red-900/30 text-red-400 border border-red-800 px-2 py-1 rounded text-sm flex items-center">
                      {domain}
                      <button 
                        type="button"
                        onClick={() => removeExcludedDomain(domain)} 
                        className="ml-2 text-red-600 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {excludedDomains.length === 0 && (
                    <span className="text-xs text-gray-500">No excluded domains added</span>
                  )}
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    value={excludedDomainInput}
                    onChange={(e) => setExcludedDomainInput(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-l-md px-3 py-2 text-white"
                    placeholder="e.g., example-blog.com"
                  />
                  <button
                    type="button"
                    onClick={addExcludedDomain}
                    className="bg-red-800 hover:bg-red-700 text-white px-3 py-2 rounded-r-md"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Search Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}