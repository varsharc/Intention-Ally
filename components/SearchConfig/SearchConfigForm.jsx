import React, { useState, useEffect } from 'react';
import { Sliders, Info, Plus, X } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuth } from '../../hooks/useAuth';

export const SearchConfigForm = ({ existingConfig = null, onComplete = () => {} }) => {
  const { user } = useAuth();
  const { addDocument, updateDocument } = useFirestore('searchConfigs');
  
  // Form state
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState({
    regulatory: true,
    academic: true,
    technology: false,
    market: true
  });
  const [authorityThreshold, setAuthorityThreshold] = useState(75);
  const [updateFrequency, setUpdateFrequency] = useState('daily');
  const [dataRetention, setDataRetention] = useState('30');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Trusted domains
  const [trustedDomains, setTrustedDomains] = useState([
    { domain: '.gov', trust: 'trusted' },
    { domain: '.edu', trust: 'trusted' },
    { domain: '.org', trust: 'trusted' },
    { domain: '.com', trust: 'neutral' }
  ]);
  const [newDomain, setNewDomain] = useState('');
  
  // Advanced parameters
  const [advancedParams, setAdvancedParams] = useState({
    relevanceThreshold: 80,
    recency: 'high',
    contentDepth: 'medium',
    requirePrimary: true,
    excludeOpinion: true,
    sourceWeights: {
      regulatory: 90,
      academic: 85,
      industry: 70,
      news: 60
    }
  });
  
  // Load existing config if provided
  useEffect(() => {
    if (existingConfig) {
      setName(existingConfig.name || '');
      setKeywords(existingConfig.keywords || []);
      setSelectedTemplates(existingConfig.templates || {
        regulatory: true,
        academic: true,
        technology: false,
        market: true
      });
      setAuthorityThreshold(existingConfig.authorityThreshold || 75);
      setUpdateFrequency(existingConfig.updateFrequency || 'daily');
      setDataRetention(existingConfig.dataRetention || '30');
      
      if (existingConfig.trustedDomains) {
        setTrustedDomains(existingConfig.trustedDomains);
      }
      
      if (existingConfig.advancedParams) {
        setAdvancedParams(existingConfig.advancedParams);
      }
    }
  }, [existingConfig]);
  
  // Add keyword to list
  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };
  
  // Remove keyword from list
  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };
  
  // Handle template checkbox change
  const handleTemplateChange = (template) => {
    setSelectedTemplates({
      ...selectedTemplates,
      [template]: !selectedTemplates[template]
    });
  };
  
  // Add trusted domain
  const handleAddDomain = () => {
    if (newDomain.trim()) {
      setTrustedDomains([...trustedDomains, { domain: newDomain.trim(), trust: 'neutral' }]);
      setNewDomain('');
    }
  };
  
  // Update domain trust level
  const updateDomainTrust = (index, trust) => {
    const updatedDomains = [...trustedDomains];
    updatedDomains[index].trust = trust;
    setTrustedDomains(updatedDomains);
  };
  
  // Remove domain
  const removeDomain = (index) => {
    setTrustedDomains(trustedDomains.filter((_, i) => i !== index));
  };
  
  // Update source weight
  const updateSourceWeight = (source, value) => {
    setAdvancedParams({
      ...advancedParams,
      sourceWeights: {
        ...advancedParams.sourceWeights,
        [source]: value
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name) {
      alert('Please provide a topic name');
      return;
    }
    
    if (keywords.length === 0) {
      alert('Please add at least one keyword');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const configData = {
        name,
        keywords,
        templates: selectedTemplates,
        authorityThreshold,
        updateFrequency,
        dataRetention,
        trustedDomains,
        advancedParams,
        userId: user.uid,
        createdAt: new Date(),
        isActive: true
      };
      
      if (existingConfig) {
        await updateDocument(existingConfig.id, configData);
        console.log('Search configuration updated successfully');
      } else {
        await addDocument(configData);
        console.log('Search configuration created successfully');
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving search configuration:', error);
      console.error('Failed to save search configuration');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        {existingConfig ? 'Edit Search Topic' : 'Create New Search Topic'}
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Topic Name</label>
          <input 
            type="text" 
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
            placeholder="e.g., EU Textile Regulations"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Keywords</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {keywords.map((keyword, index) => (
              <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center">
                {keyword}
                <button 
                  type="button"
                  className="ml-2 text-gray-400 hover:text-white"
                  onClick={() => removeKeyword(keyword)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input 
              type="text" 
              className="flex-1 bg-gray-900 border border-gray-700 rounded-l-md px-3 py-2 text-white"
              placeholder="Add a keyword or phrase..."
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            />
            <button
              type="button"
              className="bg-gray-700 text-white px-3 py-2 rounded-r-md hover:bg-gray-600"
              onClick={addKeyword}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">Domain Templates</label>
              <button 
                type="button"
                className="text-xs text-yellow-500 hover:text-yellow-400"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                Customize
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  checked={selectedTemplates.regulatory}
                  onChange={() => handleTemplateChange('regulatory')}
                />
                <span className="text-sm text-white">Regulatory</span>
              </label>
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  checked={selectedTemplates.academic}
                  onChange={() => handleTemplateChange('academic')}
                />
                <span className="text-sm text-white">Academic</span>
              </label>
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  checked={selectedTemplates.technology}
                  onChange={() => handleTemplateChange('technology')}
                />
                <span className="text-sm text-white">Technology</span>
              </label>
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" 
                  checked={selectedTemplates.market}
                  onChange={() => handleTemplateChange('market')}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Update Frequency</label>
            <select 
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
              value={updateFrequency}
              onChange={(e) => setUpdateFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="every3days">Every 3 days</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Data Retention</label>
            <select 
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>
        </div>
        
        {/* Advanced Parameters Section */}
        <div>
          <button 
            type="button"
            className="flex items-center text-sm text-yellow-500 hover:text-yellow-400"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Sliders size={16} className="mr-1" />
            <span>{showAdvanced ? 'Hide Advanced Parameters' : 'Show Advanced Parameters'}</span>
          </button>
        </div>
        
        {showAdvanced && (
          <div className="space-y-6 bg-gray-750 p-4 rounded-lg border border-gray-700">
            <h3 className="text-md font-medium text-white">Advanced Configuration</h3>
            
            {/* Source Types & Authority */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-md font-medium text-white mb-3">Source Types & Authority</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Regulatory Sources</label>
                    <span className="text-sm text-yellow-500">{advancedParams.sourceWeights.regulatory}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={advancedParams.sourceWeights.regulatory}
                      onChange={(e) => updateSourceWeight('regulatory', parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
                    />
                    <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">
                      {advancedParams.sourceWeights.regulatory}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Government, official agencies, regulatory bodies</div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Academic Sources</label>
                    <span className="text-sm text-yellow-500">{advancedParams.sourceWeights.academic}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={advancedParams.sourceWeights.academic}
                      onChange={(e) => updateSourceWeight('academic', parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
                    />
                    <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">
                      {advancedParams.sourceWeights.academic}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Universities, research institutions, journals</div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Industry Sources</label>
                    <span className="text-sm text-yellow-500">{advancedParams.sourceWeights.industry}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={advancedParams.sourceWeights.industry}
                      onChange={(e) => updateSourceWeight('industry', parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
                    />
                    <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">
                      {advancedParams.sourceWeights.industry}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Trade associations, industry reports, company announcements</div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">News & Media</label>
                    <span className="text-sm text-yellow-500">{advancedParams.sourceWeights.news}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={advancedParams.sourceWeights.news}
                      onChange={(e) => updateSourceWeight('news', parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
                    />
                    <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">
                      {advancedParams.sourceWeights.news}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">News outlets, press releases, media coverage</div>
                </div>
              </div>
            </div>
            
            {/* Domain Preferences */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-white">Domain Preferences</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="bg-gray-900 border border-gray-700 rounded-l-md px-3 py-1 text-white text-sm"
                    placeholder="Add domain..."
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDomain())}
                  />
                  <button
                    type="button"
                    className="bg-yellow-500 text-black px-2 py-1 rounded-r-md hover:bg-yellow-400 text-sm"
                    onClick={handleAddDomain}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {trustedDomains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs mr-2 ${
                        domain.trust === 'trusted' ? 'bg-green-500 text-white' : 
                        domain.trust === 'untrusted' ? 'bg-red-500 text-white' : 
                        'bg-yellow-500 text-black'
                      }`}>
                        {domain.trust === 'trusted' ? '+' : domain.trust === 'untrusted' ? '-' : '~'}
                      </div>
                      <span className="text-white">{domain.domain}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select 
                        className="bg-transparent text-sm border-none text-yellow-500"
                        value={domain.trust}
                        onChange={(e) => updateDomainTrust(index, e.target.value)}
                      >
                        <option value="trusted">Trusted</option>
                        <option value="neutral">Neutral</option>
                        <option value="untrusted">Untrusted</option>
                      </select>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                        onClick={() => removeDomain(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Content Criteria */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-md font-medium text-white mb-3">Content Criteria</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Relevance Threshold</label>
                    <span className="text-sm text-yellow-500">{advancedParams.relevanceThreshold}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={advancedParams.relevanceThreshold}
                      onChange={(e) => setAdvancedParams({
                        ...advancedParams,
                        relevanceThreshold: parseInt(e.target.value)
                      })}
                      className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
                    />
                    <div className="w-10 h-6 rounded bg-gray-900 flex items-center justify-center text-xs font-medium text-white">
                      {advancedParams.relevanceThreshold}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Minimum semantic similarity to search terms</div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Recency Preference</label>
                    <span className="text-sm text-yellow-500">
                      {advancedParams.recency.charAt(0).toUpperCase() + advancedParams.recency.slice(1)}
                    </span>
                  </div>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
                    value={advancedParams.recency}
                    onChange={(e) => setAdvancedParams({
                      ...advancedParams,
                      recency: e.target.value
                    })}
                  >
                    <option value="veryHigh">Very High (Last 24 hours)</option>
                    <option value="high">High (Last 7 days)</option>
                    <option value="medium">Medium (Last 30 days)</option>
                    <option value="low">Low (Last 90 days)</option>
                    <option value="none">None (Any time)</option>
                  </select>
                  <div className="mt-1 text-xs text-gray-500">Prioritize recent content in results</div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">Content Depth</label>
                    <span className="text-sm text-yellow-500">
                      {advancedParams.contentDepth.charAt(0).toUpperCase() + advancedParams.contentDepth.slice(1)}
                    </span>
                  </div>
                  <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
                    value={advancedParams.contentDepth}
                    onChange={(e) => setAdvancedParams({
                      ...advancedParams,
                      contentDepth: e.target.value
                    })}
                  >
                    <option value="high">High (Detailed analysis)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="low">Low (Headlines & summaries)</option>
                  </select>
                  <div className="mt-1 text-xs text-gray-500">Preference for detailed vs brief content</div>
                </div>
                
                <div className="pt-2">
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500 mr-2" 
                      checked={advancedParams.requirePrimary}
                      onChange={() => setAdvancedParams({
                        ...advancedParams,
                        requirePrimary: !advancedParams.requirePrimary
                      })}
                    />
                    Require primary sources
                  </label>
                  <div className="text-xs text-gray-500">Prioritize original sources over aggregators</div>
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500 mr-2" 
                      checked={advancedParams.excludeOpinion}
                      onChange={() => setAdvancedParams({
                        ...advancedParams,
                        excludeOpinion: !advancedParams.excludeOpinion
                      })}
                    />
                    Exclude opinion content
                  </label>
                  <div className="text-xs text-gray-500">Filter out editorial and opinion pieces</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-4">
          {existingConfig && (
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-md"
              onClick={onComplete}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md disabled:bg-yellow-700 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : existingConfig ? 'Update Search Topic' : 'Create Search Topic'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchConfigForm;