// types/database.types.ts
export type UserId = string;
export type ConfigId = string;
export type ResultId = string;
export type ClusterId = string;

// User settings
export interface UserSettings {
  userId: UserId;
  defaultAuthorityThreshold: number;
  trustedDomains: string[];
  excludedDomains: string[];
  defaultUpdateFrequency: 'daily' | 'weekly' | 'monthly';
  notificationPreferences: {
    email: boolean;
    app: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  isAdmin?: boolean;
}

// Search configuration
export interface SearchConfig {
  id: ConfigId;
  userId: UserId;
  name: string;
  keywords: string[];
  templateType: 'regulatory' | 'academic' | 'technology' | 'market' | string;
  authorityThreshold: number;
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  advancedParams: {
    trustedDomains?: string[];
    excludedDomains?: string[];
    recencyWindow?: string;
    useDeepSearch?: boolean;
    [key: string]: any;
  };
  createdAt: Date;
  isActive: boolean;
}

// Search result
export interface SearchResult {
  id: ResultId;
  configId: ConfigId;
  title: string;
  url: string;
  snippet?: string;
  sourceDomain: string;
  authorityScore: number;
  discoveredAt: Date;
  metadata: {
    sourceType?: string;
    publicationDate?: Date;
    authors?: string[];
    cluster?: ClusterId;
    visualCoordinates?: {
      x: number;
      y: number;
    };
    [key: string]: any;
  };
}

// Result cluster
export interface ResultCluster {
  id: ClusterId;
  name: string;
  description?: string;
  createdAt: Date;
  memberships: {
    [resultId: string]: {
      similarityScore: number;
    };
  };
}

// Usage log
export interface UsageLog {
  id: string;
  userId: UserId;
  service: 'tavily' | 'claude' | 'firebase' | string;
  action: string;
  resourcesConsumed: {
    apiCalls?: number;
    tokensUsed?: number;
    storageBytes?: number;
    [key: string]: any;
  };
  timestamp: Date;
}