// Intention-Ally Component Index
// Export all components for easy importing

// Layout Components
export { AppLayout, Sidebar } from './ui-layout';

// Search Configuration Components
export { SearchConfigForm } from './ui-search-config';

// Knowledge Graph Components
export { KnowledgeGraph } from './ui-knowledge-graph';

// Results List Components
export { ResultsList, ResultSummary } from './ui-results-list';

// Admin Dashboard Components
export { 
  AdminOverviewCards,
  ResourceUsageChart,
  UsageLimitsPanel,
  UserResourceAllocation
} from './ui-admin-components';

// Advanced Filter Components
export {
  AdvancedFilters,
  SourceTypesFilter,
  DomainPreferencesFilter,
  ContentCriteriaFilter,
  VisualizationSettings
} from './ui-advanced-filters';

// Main Admin Dashboard Page
export const AdminDashboard = () => {
  return (
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
  );
};

// Example Pages
export const SearchResultsPage = () => (
  <AppLayout>
    <ResultSummary />
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <KnowledgeGraph />
      </div>
      <div className="col-span-1">
        <ResultsList />
      </div>
    </div>
  </AppLayout>
);

export const AdminDashboardPage = () => (
  <AppLayout>
    <AdminDashboard />
  </AppLayout>
);

export const SearchConfigPage = () => (
  <AppLayout>
    <SearchConfigForm />
  </AppLayout>
);

export const AdvancedSettingsPage = () => (
  <AppLayout>
    <AdvancedFilters />
  </AppLayout>
);
