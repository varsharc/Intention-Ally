/**
 * FirebaseContext.js
 * 
 * Provides application-wide access to Firebase services and authenticated user state.
 * This context wraps the entire application to make Firebase easily accessible
 * to all components without prop drilling.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { initFirebase } from '../services/firebase';

// Create context
const FirebaseContext = createContext(null);

// Firebase context provider component
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize Firebase on component mount
  useEffect(() => {
    try {
      // Initialize Firebase app and Firestore
      const db = initFirebase();
      
      // Set up authentication listener
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          // User is signed in
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
          });
        } else {
          // User is signed out
          setUser(null);
        }
        setLoading(false);
      }, (authError) => {
        console.error('Auth state change error:', authError);
        setError(authError);
        setLoading(false);
      });
      
      // Clean up subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setError(error);
      setLoading(false);
    }
  }, []);
  
  /**
   * Signs in a user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<object>} - Auth user object
   */
  const signIn = async (email, password) => {
    try {
      setError(null);
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      setError(error);
      throw error;
    }
  };
  
  /**
   * Creates a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<object>} - Auth user object
   */
  const signUp = async (email, password) => {
    try {
      setError(null);
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error);
      throw error;
    }
  };
  
  /**
   * Signs out the current user
   * @returns {Promise<void>}
   */
  const signOut = async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error);
      throw error;
    }
  };
  
  // Context value
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    db: initFirebase(),
    auth: getAuth(),
  };
  
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook for accessing Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseContext;
