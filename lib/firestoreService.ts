// lib/firestoreService.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  DocumentReference,
  DocumentData,
  WhereFilterOp
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  SearchConfig, 
  SearchResult, 
  ResultCluster, 
  UsageLog, 
  UserSettings 
} from '@/types/database.types';

// Type-safe collection references
const collections = {
  users: () => collection(db, 'users'),
  searchConfigs: () => collection(db, 'searchConfigs'),
  searchResults: () => collection(db, 'searchResults'),
  resultClusters: () => collection(db, 'resultClusters'),
  usageLogs: () => collection(db, 'usageLogs')
};

// Generic helper functions
async function getDocument<T>(collectionName: keyof typeof collections, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as T;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

async function setDocument<T>(collectionName: keyof typeof collections, id: string, data: T): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data);
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
}

async function updateDocument<T>(collectionName: keyof typeof collections, id: string, data: Partial<T>): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data as DocumentData);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

async function deleteDocument(collectionName: keyof typeof collections, id: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

async function addDocument<T>(collectionName: keyof typeof collections, data: T): Promise<string> {
  try {
    const colRef = collections[collectionName]();
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

async function queryDocuments<T>(
  collectionName: keyof typeof collections,
  conditions: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>,
  sortField?: string,
  sortDirection?: 'asc' | 'desc',
  limitCount?: number
): Promise<T[]> {
  try {
    let q = query(collections[collectionName]());
    
    // Add where conditions
    for (const condition of conditions) {
      q = query(q, where(condition.field, condition.operator, condition.value));
    }
    
    // Add sorting if specified
    if (sortField) {
      q = query(q, orderBy(sortField, sortDirection));
    }
    
    // Add limit if specified
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return results;
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
}

// Convert JavaScript Date objects to Firestore Timestamps and vice versa
function convertDatesToTimestamps<T>(data: T): any {
  if (!data) return data;
  
  const result: any = { ...data };
  
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    // Convert Date objects to Firestore Timestamps
    if (value instanceof Date) {
      result[key] = Timestamp.fromDate(value);
    } 
    // Handle nested objects recursively
    else if (typeof value === 'object' && value !== null) {
      result[key] = convertDatesToTimestamps(value);
    }
  });
  
  return result;
}

function convertTimestampsToDates<T>(data: any): T {
  if (!data) return data as T;
  
  const result: any = { ...data };
  
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    // Convert Firestore Timestamps to JavaScript Date objects
    if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
      result[key] = value.toDate();
    } 
    // Handle nested objects recursively
    else if (typeof value === 'object' && value !== null) {
      result[key] = convertTimestampsToDates(value);
    }
  });
  
  return result as T;
}

// Specific service functions for each collection
export const userService = {
  async getUser(userId: string): Promise<UserSettings | null> {
    return getDocument<UserSettings>('users', userId);
  },
  
  async setUser(userId: string, data: UserSettings): Promise<void> {
    await setDocument('users', userId, convertDatesToTimestamps(data));
  },
  
  async updateUser(userId: string, data: Partial<UserSettings>): Promise<void> {
    await updateDocument('users', userId, convertDatesToTimestamps(data));
  }
};

export const searchConfigService = {
  async getSearchConfig(configId: string): Promise<SearchConfig | null> {
    const config = await getDocument<SearchConfig>('searchConfigs', configId);
    return config ? convertTimestampsToDates<SearchConfig>(config) : null;
  },
  
  async createSearchConfig(config: Omit<SearchConfig, 'id'>): Promise<string> {
    const configWithTimestamps = convertDatesToTimestamps({
      ...config,
      createdAt: new Date()
    });
    return addDocument('searchConfigs', configWithTimestamps);
  },
  
  async updateSearchConfig(configId: string, data: Partial<SearchConfig>): Promise<void> {
    await updateDocument('searchConfigs', configId, convertDatesToTimestamps(data));
  },
  
  async deleteSearchConfig(configId: string): Promise<void> {
    await deleteDocument('searchConfigs', configId);
  },
  
  async getUserConfigs(userId: string): Promise<SearchConfig[]> {
    const configs = await queryDocuments<SearchConfig>('searchConfigs', [
      { field: 'userId', operator: '==', value: userId }
    ], 'createdAt', 'desc');
    
    return configs.map(config => convertTimestampsToDates<SearchConfig>(config));
  }
};

export const searchResultService = {
  async getSearchResult(resultId: string): Promise<SearchResult | null> {
    const result = await getDocument<SearchResult>('searchResults', resultId);
    return result ? convertTimestampsToDates<SearchResult>(result) : null;
  },
  
  async addSearchResult(result: Omit<SearchResult, 'id'>): Promise<string> {
    const resultWithTimestamps = convertDatesToTimestamps(result);
    return addDocument('searchResults', resultWithTimestamps);
  },
  
  async addMultipleSearchResults(results: Omit<SearchResult, 'id'>[]): Promise<string[]> {
    const ids: string[] = [];
    
    for (const result of results) {
      const resultWithTimestamps = convertDatesToTimestamps(result);
      const id = await addDocument('searchResults', resultWithTimestamps);
      ids.push(id);
    }
    
    return ids;
  },
  
  async updateSearchResult(resultId: string, data: Partial<SearchResult>): Promise<void> {
    await updateDocument('searchResults', resultId, convertDatesToTimestamps(data));
  },
  
  async deleteSearchResult(resultId: string): Promise<void> {
    await deleteDocument('searchResults', resultId);
  },
  
  async getResultsForConfig(
    configId: string, 
    options: {
      minAuthority?: number,
      limit?: number,
      offset?: number,
      sortBy?: string,
      sortDirection?: 'asc' | 'desc'
    } = {}
  ): Promise<SearchResult[]> {
    const conditions = [
      { field: 'configId', operator: '==', value: configId }
    ];
    
    if (options.minAuthority) {
      conditions.push({
        field: 'authorityScore',
        operator: '>=',
        value: options.minAuthority
      });
    }
    
    const sortField = options.sortBy || 'discoveredAt';
    const sortDirection = options.sortDirection || 'desc';
    const limitCount = options.limit || 50;
    
    const results = await queryDocuments<SearchResult>(
      'searchResults',
      conditions,
      sortField,
      sortDirection,
      limitCount
    );
    
    return results.map(result => convertTimestampsToDates<SearchResult>(result));
  }
};

export const clusterService = {
  async getCluster(clusterId: string): Promise<ResultCluster | null> {
    const cluster = await getDocument<ResultCluster>('resultClusters', clusterId);
    return cluster ? convertTimestampsToDates<ResultCluster>(cluster) : null;
  },
  
  async createCluster(cluster: Omit<ResultCluster, 'id'>): Promise<string> {
    const clusterWithTimestamps = convertDatesToTimestamps({
      ...cluster,
      createdAt: new Date()
    });
    return addDocument('resultClusters', clusterWithTimestamps);
  },
  
  async updateCluster(clusterId: string, data: Partial<ResultCluster>): Promise<void> {
    await updateDocument('resultClusters', clusterId, convertDatesToTimestamps(data));
  },
  
  async deleteCluster(clusterId: string): Promise<void> {
    await deleteDocument('resultClusters', clusterId);
  }
};

export const usageLogService = {
  async logUsage(log: Omit<UsageLog, 'id' | 'timestamp'>): Promise<string> {
    const logWithTimestamp = {
      ...log,
      timestamp: new Date()
    };
    return addDocument('usageLogs', convertDatesToTimestamps(logWithTimestamp));
  },
  
  async getUserUsageLogs(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<UsageLog[]> {
    const conditions = [
      { field: 'userId', operator: '==', value: userId }
    ];
    
    if (startDate) {
      conditions.push({
        field: 'timestamp',
        operator: '>=',
        value: Timestamp.fromDate(startDate)
      });
    }
    
    if (endDate) {
      conditions.push({
        field: 'timestamp',
        operator: '<=',
        value: Timestamp.fromDate(endDate)
      });
    }
    
    const logs = await queryDocuments<UsageLog>(
      'usageLogs',
      conditions,
      'timestamp',
      'desc'
    );
    
    return logs.map(log => convertTimestampsToDates<UsageLog>(log));
  }
};