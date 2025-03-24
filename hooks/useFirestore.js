/**
 * useFirestore.js
 * 
 * Custom React hooks for Firestore operations
 * Provides hooks for common Firestore operations like fetching, adding, updating, and deleting documents
 */
import { useState, useEffect } from 'react';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  deleteDoc, addDoc, query, where, orderBy, limit, onSnapshot
} from 'firebase/firestore';
import { useFirebase } from '../contexts/FirebaseContext';

/**
 * Hook to fetch a single document from Firestore
 * @param {string} collectionName - Name of the Firestore collection
 * @param {string} documentId - ID of the document to fetch
 * @returns {Object} - Document data, loading state, and error
 */
export const useDocument = (collectionName, documentId) => {
  const { db } = useFirebase();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (!documentId) {
          setData(null);
          setLoading(false);
          return;
        }
        
        setLoading(true);
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching document ${documentId} from ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [db, collectionName, documentId]);

  return { data, loading, error };
};

/**
 * Hook to fetch a collection of documents from Firestore
 * @param {string} collectionName - Name of the Firestore collection
 * @param {Array} conditions - Optional array of query conditions: [field, operator, value]
 * @param {Array} sortOptions - Optional sorting options: [field, direction]
 * @param {number} limitCount - Optional limit on the number of documents
 * @returns {Object} - Collection data, loading state, and error
 */
export const useCollection = (collectionName, conditions = [], sortOptions = null, limitCount = null) => {
  const { db } = useFirebase();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        
        // Build query with conditions, sorting, and limits
        let collectionRef = collection(db, collectionName);
        let queryRef = collectionRef;
        
        if (conditions.length > 0) {
          const queryConstraints = conditions.map(([field, operator, value]) => {
            return where(field, operator, value);
          });
          
          queryRef = query(collectionRef, ...queryConstraints);
        }
        
        if (sortOptions) {
          const [field, direction] = sortOptions;
          queryRef = query(queryRef, orderBy(field, direction));
        }
        
        if (limitCount) {
          queryRef = query(queryRef, limit(limitCount));
        }
        
        const querySnapshot = await getDocs(queryRef);
        const documents = [];
        
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        
        setData(documents);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching collection ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCollection();
  }, [db, collectionName, JSON.stringify(conditions), JSON.stringify(sortOptions), limitCount]);

  return { data, loading, error };
};

/**
 * Hook to get real-time updates from a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @param {Array} conditions - Optional array of query conditions: [field, operator, value]
 * @returns {Object} - Collection data, loading state, and error
 */
export const useCollectionRealtime = (collectionName, conditions = []) => {
  const { db } = useFirebase();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Build query with conditions
      let collectionRef = collection(db, collectionName);
      let queryRef = collectionRef;
      
      if (conditions.length > 0) {
        const queryConstraints = conditions.map(([field, operator, value]) => {
          return where(field, operator, value);
        });
        
        queryRef = query(collectionRef, ...queryConstraints);
      }
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
        const documents = [];
        
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        
        setData(documents);
        setLoading(false);
      }, (err) => {
        console.error(`Error in real-time updates for ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      });
      
      // Cleanup listener on component unmount
      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up real-time listener for ${collectionName}:`, err);
      setError(err);
      setLoading(false);
    }
  }, [db, collectionName, JSON.stringify(conditions)]);

  return { data, loading, error };
};

/**
 * Hook providing CRUD operations for a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @returns {Object} - CRUD operations and loading/error states
 */
export const useCRUD = (collectionName) => {
  const { db } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Add a new document to the collection
   * @param {Object} data - Document data to add
   * @param {string} customId - Optional custom document ID
   * @returns {Promise<string>} - ID of the new document
   */
  const addDocument = async (data, customId = null) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      let docRef;
      
      if (customId) {
        // Use custom ID
        docRef = doc(db, collectionName, customId);
        await setDoc(docRef, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // Let Firestore generate ID
        docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      setSuccess(`Document added successfully with ID: ${customId || docRef.id}`);
      setLoading(false);
      return customId || docRef.id;
    } catch (err) {
      console.error(`Error adding document to ${collectionName}:`, err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Update an existing document
   * @param {string} documentId - ID of the document to update
   * @param {Object} data - Data to update
   * @returns {Promise<void>}
   */
  const updateDocument = async (documentId, data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const docRef = doc(db, collectionName, documentId);
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      
      setSuccess(`Document ${documentId} updated successfully`);
      setLoading(false);
    } catch (err) {
      console.error(`Error updating document ${documentId} in ${collectionName}:`, err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Delete a document
   * @param {string} documentId - ID of the document to delete
   * @returns {Promise<void>}
   */
  const deleteDocument = async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      
      setSuccess(`Document ${documentId} deleted successfully`);
      setLoading(false);
    } catch (err) {
      console.error(`Error deleting document ${documentId} from ${collectionName}:`, err);
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    loading,
    error,
    success
  };
};
