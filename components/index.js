// Export all UI components from a single file for easier imports
import React from "react";

// Import the individual components directly
import MainLayoutFromFile from "./layout/MainLayout";
import KnowledgeGraphFromFile from "./KnowledgeGraph"; 
import { KnowledgeGraph as KnowledgeGraphFromUI } from "./ui-knowledge-graph";
import { MainLayout as UIMainLayout, SearchPageLayout, KeywordTag } from "./ui-layout";

// Export MainLayout from layout folder (used in pages)
export const MainLayout = MainLayoutFromFile;

// Export UI Layout Components
export { SearchPageLayout, KeywordTag };

// Knowledge Graph Components - export with different names to avoid conflicts
export const KnowledgeGraph = KnowledgeGraphFromFile; // Default export from KnowledgeGraph.jsx
export const SimpleKnowledgeGraph = KnowledgeGraphFromUI; // Named export from ui-knowledge-graph.jsx

// Results Components
export { ResultsList, ResultSummary } from "./ui-results-list";

// Admin Dashboard Components
export {
  AdminOverviewCards,
  ResourceUsageChart,
  UsageLimitsPanel,
  UserResourceAllocation,
} from "./ui-admin-components";

// Search Configuration Components
export { SearchConfigForm } from "./ui-search-config";

// Advanced Filter Components
export {
  AdvancedFilters,
  SourceTypesFilter,
  DomainPreferencesFilter,
  ContentCriteriaFilter,
  VisualizationSettings,
} from "./ui-advanced-filters";

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
