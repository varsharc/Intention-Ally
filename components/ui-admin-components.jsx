// Admin Dashboard Components
import React from 'react';
import { 
  Database, 
  Server, 
  Search, 
  HardDrive, 
  Calendar, 
  User,
  Zap
} from 'lucide-react';

// Admin Overview Cards Component
export const AdminOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Search Topics</p>
            <h3 className="text-2xl font-bold text-white mt-1">12</h3>
          </div>
          <div className="p-2 bg-indigo-500 bg-opacity-20 rounded">
            <Search size={20} className="text-indigo-400" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-500">+3</span>
          <span className="text-gray-400 ml-1">since last month</span>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm">Query Volume (30 days)</p>
            <h3 className="text-2xl font-bold text-white mt-1">1,482</h3>
          </div>
          <div className="p-2 bg-yellow-500 bg-opacity-20 rounded">
            <Database size={20} className="text-yellow-500" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-500">+18%</span>
          <span className="text-gray-400 ml-1">vs previous period</span>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm">Storage Used</p>
            <h3 className="text-2xl font-bold text-white mt-1">38.4 GB</h3>
          </div>
          <div className="p-2 bg-cyan-500 bg-opacity-20 rounded">
            <HardDrive size={20} className="text-cyan-400" />
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-yellow-500">76%</span>
          <span className="text-gray-400 ml-1">of allocated quota</span>
        </div>
      </div>
    </div>
  );
};

// Resource Usage Chart Component
export const ResourceUsageChart = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Resource Usage</h3>
        
        <div className="flex space-x-2">
          <button className="bg-gray-700 px-3 py-1 rounded text-sm">Day</button>
          <button className="bg-yellow-500 text-black px-3 py-1 rounded text-sm">Week</button>
          <button className="bg-gray-700 px-3 py-1 rounded text-sm">Month</button>
        </div>
      </div>
      
      {/* Chart Placeholder */}
      <div className="h-64 bg-gray-900 rounded-lg relative overflow-hidden">
        {/* Y-axis labels */}
        <div className="absolute top-0 left-4 bottom-0 flex flex-col justify-between py-4 text-xs text-gray-400">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        {/* Sample bar chart - would be replaced with actual chart library */}
        <div className="absolute inset-0 flex items-end justify-around px-12 pb-8">
          {/* API Calls */}
          <div className="flex flex-col items-center">
            <div className="w-10 bg-indigo-500 rounded-t" style={{ height: '70%' }}></div>
            <span className="mt-2 text-xs text-gray-400">Mon</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 bg-indigo-500 rounded-t" style={{ height: '55%' }}></div>
            <span className="mt-2 text-xs text-gray-400">Tue</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 bg-indigo-500 rounded-t" style={{ height: '85%' }}></div>
            <span className="mt-2 text-xs text-gray-400">Wed</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 bg-indigo-500 rounded-t" style={{ height: '65%' }}></div>
            <span className="mt-2 text-xs text-gray-400">Thu</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 bg-indigo-500 rounded-t" style={{ height: '75%' }}></div>
            <span className="mt-2 text-xs text-gray-400">Fri</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 bg-indigo-500 rounded-t" style={{ height: '40%' }}></div>
            <span className="mt-2 text-xs text-gray-400">Sat</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 bg-indigo-500 rounded-t" style={{ height: '30%' }}></div>
            <span className="mt-2 text-xs text-gray-400">Sun</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center space-x-8">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-300">API Calls</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-300">Storage</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-300">Computation</span>
        </div>
      </div>
    </div>
  );
};

// Usage Limits Panel Component
export const UsageLimitsPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-4">Service Usage Limits</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Server size={14} className="text-yellow-500 mr-2" />
                <span className="text-sm text-gray-300">API Calls</span>
              </div>
              <span className="text-xs text-yellow-500">7,482 / 10,000</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <HardDrive size={14} className="text-cyan-500 mr-2" />
                <span className="text-sm text-gray-300">Storage</span>
              </div>
              <span className="text-xs text-cyan-500">38.4 GB / 50 GB</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Calendar size={14} className="text-green-500 mr-2" />
                <span className="text-sm text-gray-300">Data Retention</span>
              </div>
              <span className="text-xs text-green-500">90 days / 90 days</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Zap size={14} className="text-indigo-500 mr-2" />
                <span className="text-sm text-gray-300">Computation</span>
              </div>
              <span className="text-xs text-indigo-500">432 min / 600 min</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md w-full">
            Upgrade Plan
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-4">Current Plan Details</h3>
        
        <div className="bg-gray-750 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Business Plan</span>
            <span className="bg-yellow-500 text-black text-xs font-medium px-2 py-0.5 rounded">ACTIVE</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1 mb-2">$49.99<span className="text-sm text-gray-400 font-normal"> / month</span></div>
          <div className="text-sm text-gray-300">Renews on April 23, 2025</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <span className="text-yellow-500 text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-300">10,000 monthly API calls</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <span className="text-yellow-500 text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-300">50GB storage</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <span className="text-yellow-500 text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-300">90 days data retention</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <span className="text-yellow-500 text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-300">Email & priority support</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <span className="text-yellow-500 text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-300">Custom API integrations</span>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button className="bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-medium px-4 py-2 rounded-md flex-1">
            Change Plan
          </button>
          <button className="bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-700 font-medium px-4 py-2 rounded-md flex-1">
            Billing History
          </button>
        </div>
      </div>
    </div>
  );
};

// User Resource Allocation Component
export const UserResourceAllocation = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">User Resource Allocation</h3>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
          Add User
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-750">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">API Usage</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Storage</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr className="hover:bg-gray-800">
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="font-medium text-black">JD</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Jane Doe</div>
                    <div className="text-xs text-gray-400">jane@example.com</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-indigo-900 text-indigo-300 rounded-full">Admin</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">65%</span>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">42%</span>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">Active</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm">
                <button className="text-gray-400 hover:text-white mr-2">Edit</button>
                <button className="text-gray-400 hover:text-white">Restrict</button>
              </td>
            </tr>
            
            <tr className="hover:bg-gray-800">
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <span className="font-medium text-white">JS</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">John Smith</div>
                    <div className="text-xs text-gray-400">john@example.com</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-cyan-900 text-cyan-300 rounded-full">Researcher</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">80%</span>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">35%</span>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">Active</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm">
                <button className="text-gray-400 hover:text-white mr-2">Edit</button>
                <button className="text-gray-400 hover:text-white">Restrict</button>
              </td>
            </tr>
            
            <tr className="hover:bg-gray-800">
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="font-medium text-white">AK</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Alice Kim</div>
                    <div className="text-xs text-gray-400">alice@example.com</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">Viewer</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">15%</span>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                    <div className="h-full bg-cyan-500" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">5%</span>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-yellow-900 text-yellow-300 rounded-full">Idle</span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm">
                <button className="text-gray-400 hover:text-white mr-2">Edit</button>
                <button className="text-gray-400 hover:text-white">Restrict</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};