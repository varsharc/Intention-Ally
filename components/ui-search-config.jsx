// Search Configuration Form Component
import React from 'react';
import { Sliders, Info } from 'lucide-react';

export const SearchConfigForm = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Create New Search Topic</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Topic Name</label>
          <input 
            type="text" 
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
            placeholder="e.g., EU Textile Regulations"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Keywords</label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center">
              textile regulation
              <button className="ml-2 text-gray-400 hover:text-white">×</button>
            </span>
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center">
              EU sustainability
              <button className="ml-2 text-gray-400 hover:text-white">×</button>
            </span>
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center">
              ESG textile
              <button className="ml-2 text-gray-400 hover:text-white">×</button>
            </span>
          </div>
          <input 
            type="text" 
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
            placeholder="Add a keyword or phrase..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">Domain Templates</label>
              <button className="text-xs text-yellow-500 hover:text-yellow-400">Customize</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" defaultChecked />
                <span className="text-sm text-white">Regulatory</span>
              </label>
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" defaultChecked />
                <span className="text-sm text-white">Academic</span>
              </label>
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" />
                <span className="text-sm text-white">Technology</span>
              </label>
              <label className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer">
                <input type="checkbox" className="form-checkbox bg-gray-700 border-gray-600 text-yellow-500" defaultChecked />
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
              <span className="text-sm text-yellow-500">75%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="75" 
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
            <select className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white">
              <option>Daily</option>
              <option>Every 3 days</option>
              <option>Weekly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Data Retention</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white">
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
              <option>Indefinite</option>
            </select>
          </div>
        </div>
        
        <div>
          <button className="flex items-center text-sm text-yellow-500 hover:text-yellow-400">
            <Sliders size={16} className="mr-1" />
            <span>Show Advanced Parameters</span>
          </button>
        </div>
        
        <div className="flex justify-end">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md">
            Create Search Topic
          </button>
        </div>
      </div>
    </div>
  );
};