// Export all UI components from a single file for easier imports

// Main Layout Components
export { MainLayout, SearchPageLayout, KeywordTag } from './ui-layout';

// Knowledge Graph Component
export { KnowledgeGraph } from './ui-knowledge-graph';

// Results Components
export { ResultsList, ResultSummary } from './ui-results-list';

// Admin Dashboard Components
export { 
  AdminOverviewCards,
  ResourceUsageChart,
  UsageLimitsPanel,
  UserResourceAllocation
} from './ui-admin-components';

// Search Configuration Components
export { SearchConfigForm } from './ui-search-config';

// Advanced Filter Components
export { 
  AdvancedFilters,
  SourceTypesFilter,
  DomainPreferencesFilter,
  ContentCriteriaFilter,
  VisualizationSettings
} from './ui-advanced-filters';

// Page Components for Next.js Router
export const SearchResultsPage = () => (
  <div className="text-white">
    <h1>Search Results Page</h1>
    <p>This component will be rendered at /search</p>
  </div>
);

export const AdminDashboardPage = () => (
  <div className="text-white">
    <h1>Admin Dashboard Page</h1>
    <p>This component will be rendered at /admin</p>
  </div>
);

export const SearchConfigPage = () => (
  <div className="text-white">
    <h1>Search Configuration Page</h1>
    <p>This component will be rendered at /search/configure</p>
  </div>
);

export const AdvancedSettingsPage = () => (
  <div className="text-white">
    <h1>Advanced Settings Page</h1>
    <p>This component will be rendered at /search/filters</p>
  </div>
);