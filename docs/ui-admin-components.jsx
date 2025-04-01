// Admin Dashboard Components
import React from 'react';
import { Clock, Database, User, BarChart } from 'lucide-react';

// Admin Overview Cards
export const AdminOverviewCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-400">Total API Calls</h3>
          <Database size={16} className="text-yellow-500" />
        </div>
        <p className="text-2xl font-bold text-white">1,243</p>
        <p className="text-xs text-gray-500">75% of monthly limit</p>
        <div className="w-full h-1 bg-gray-700 mt-2">
          <div className="h-1 bg-yellow-500 w-3/4"></div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
          <User size={16} className="text-yellow-500" />
        </div>
        <p className="text-2xl font-bold text-white">7</p>
        <p className="text-xs text-green-500">+2 from last month</p>
        <div className="w-full h-1 bg-gray-700 mt-2">
          <div className="h-1 bg-green-500 w-1/4"></div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-400">Database Storage</h3>
          <Database size={16} className="text-yellow-500" />
        </div>
        <p className="text-2xl font-bold text-white">128 MB</p>
        <p className="text-xs text-gray-500">25% of free tier limit</p>
        <div className="w-full h-1 bg-gray-700 mt-2">
          <div className="h-1 bg-blue-500 w-1/4"></div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-400">Claude API Costs</h3>
          <BarChart size={16} className="text-yellow-500" />
        </div>
        <p className="text-2xl font-bold text-white">$8.75</p>
        <p className="text-xs text-gray-500">This month</p>
        <div className="w-full h-1 bg-gray-700 mt-2">
          <div className="h-1 bg-purple-500 w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

// Resource Usage Chart
export const ResourceUsageChart = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 col-span-2 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Resource Usage Over Time</h3>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 text-xs bg-gray-700 rounded text-white">API Calls</button>
          <button className="px-2 py-1 text-xs bg-gray-900 rounded text-gray-400">Storage</button>
          <button className="px-2 py-1 text-xs bg-gray-900 rounded text-gray-400">Costs</button>
        </div>
      </div>
      
      <div className="flex-1 bg-gray-900 rounded p-2 relative h-64">
        <svg width="100%" height="100%" viewBox="0 0 600 200">
          {/* Grid */}
          <line x1="0" y1="0" x2="0" y2="200" stroke="#333" strokeWidth="1" />
          <line x1="0" y1="0" x2="600" y2="0" stroke="#333" strokeWidth="1" />
          <line x1="0" y1="50" x2="600" y2="50" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="0" y1="100" x2="600" y2="100" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="0" y1="150" x2="600" y2="150" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="0" y1="200" x2="600" y2="200" stroke="#333" strokeWidth="1" />
          
          {/* X axis labels */}
          <text x="0" y="220" fill="#666" fontSize="12">Mar 1</text>
          <text x="150" y="220" fill="#666" fontSize="12">Mar 8</text>
          <text x="300" y="220" fill="#666" fontSize="12">Mar 15</text>
          <text x="450" y="220" fill="#666" fontSize="12">Mar 22</text>
          <text x="590" y="220" fill="#666" fontSize="12">Today</text>
          
          {/* Y axis labels */}
          <text x="-25" y="200" fill="#666" fontSize="12">0</text>
          <text x="-25" y="150" fill="#666" fontSize="12">25</text>
          <text x="-25" y="100" fill="#666" fontSize="12">50</text>
          <text x="-25" y="50" fill="#666" fontSize="12">75</text>
          <text x="-30" y="10" fill="#666" fontSize="12">100</text>
          
          {/* Data line */}
          <path d="M0,180 L30,170 L60,175 L90,160 L120,140 L150,145 L180,130 L210,125 L240,100 L270,110 L300,90 L330,95 L360,80 L390,85 L420,75 L450,65 L480,70 L510,50 L540,55 L570,40 L600,30" 
                stroke="#FFD700" strokeWidth="2" fill="none" />
                
          {/* Limit threshold */}
          <line x1="0" y1="20" x2="600" y2="20" stroke="#E74C3C" strokeWidth="1" strokeDasharray="5,3" />
          <text x="550" y="15" fill="#E74C3C" fontSize="10">Limit (100%)</text>
          
          {/* Warning threshold */}
          <line x1="0" y1="40" x2="600" y2="40" stroke="#F39C12" strokeWidth="1" strokeDasharray="5,3" />
          <text x="550" y="35" fill="#F39C12" fontSize="10">Warning (90%)</text>
        </svg>
      </div>
      
      <div className="flex justify-between text-sm text-gray-400 mt-2">
        <span>Daily average: 42 API calls</span>
        <span>Projected monthly: 1,260</span>
        <span>Monthly limit: 2,000</span>
      </div>
    </div>
  );
};

// Usage Limits Panel
export const UsageLimitsPanel = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Usage Limits</h3>
        <button className="text-yellow-500 text-sm hover:text-yellow-400">Configure</button>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Global API Limit</h4>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="5000" 
              defaultValue="2000" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-16 text-right text-white">2,000</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Monthly maximum across all users</div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Per User Limit</h4>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="1000" 
              defaultValue="500" 
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-700"
            />
            <div className="w-16 text-right text-white">500</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Monthly maximum per user</div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Alert Thresholds</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-500">Warning</span>
              <span className="text-xs text-white">75%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-500">Critical</span>
              <span className="text-xs text-white">90%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-500">Lockout</span>
              <span className="text-xs text-white">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Resource Allocation
export const UserResourceAllocation = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">User Resource Allocation</h3>
        <select className="bg-transparent text-sm border-none text-yellow-500">
          <option>API Usage</option>
          <option>Storage</option>
          <option>Searches</option>
        </select>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xs mr-2">A</div>
            <span className="text-white">Archit (You)</span>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">874</p>
            <p className="text-xs text-gray-400">API calls</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs mr-2">S</div>
            <span className="text-gray-300">Sarah</span>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">214</p>
            <p className="text-xs text-gray-400">API calls</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs mr-2">M</div>
            <span className="text-gray-300">Michael</span>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">98</p>
            <p className="text-xs text-gray-400">API calls</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs mr-2">J</div>
            <span className="text-gray-300">Jessica</span>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">57</p>
            <p className="text-xs text-gray-400">API calls</p>
          </div>
        </div>
      </div>
    </div>
  );
};
