import React from 'react';
import { AppLayout } from '../../components/ui-layout';
import { 
  AdminOverviewCards, 
  ResourceUsageChart, 
  UsageLimitsPanel,
  UserResourceAllocation 
} from '../../components/ui-admin-components';
import { Clock } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          
          <div className="flex space-x-2">
            <div className="p-2 bg-gray-800 rounded flex items-center space-x-2">
              <Clock size={16} />
              <select className="bg-transparent text-sm">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 24 hours</option>
              </select>
            </div>
            <button className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">
              Export Report
            </button>
          </div>
        </div>
        
        <AdminOverviewCards />
        <ResourceUsageChart />
        <UsageLimitsPanel />
        <UserResourceAllocation />
      </div>
    </AppLayout>
  );
}