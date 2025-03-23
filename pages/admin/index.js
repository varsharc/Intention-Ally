import React from 'react';
import { 
  MainLayout, 
  AdminOverviewCards,
  ResourceUsageChart,
  UsageLimitsPanel,
  UserResourceAllocation
} from '../../components';

export default function AdminPage() {
  return (
    <MainLayout activePage="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-3">
            <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm">Export Data</button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-3 py-1 rounded text-sm">
              Run Manual Scan
            </button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <AdminOverviewCards />
        
        {/* Resource Chart and Allocation */}
        <div className="grid grid-cols-3 gap-6">
          <ResourceUsageChart />
          <UserResourceAllocation />
        </div>
        
        {/* Usage Limits */}
        <UsageLimitsPanel />
      </div>
    </MainLayout>
  );
}