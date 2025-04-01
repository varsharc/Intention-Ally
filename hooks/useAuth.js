import { useState, useEffect } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';

/**
 * Custom hook for authentication functionality
 * Wraps the useFirebase hook to provide a simpler interface for auth operations
 */
export const useAuth = () => {
  const { user, loading, error, signIn, signUp, signOut } = useFirebase();
  const [authError, setAuthError] = useState(null);

  // Clear error on component unmount
  useEffect(() => {
    return () => setAuthError(null);
  }, []);

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User object
   */
  const login = async (email, password) => {
    try {
      setAuthError(null);
      return await signIn(email, password);
    } catch (error) {
      setAuthError(error.message || 'Failed to sign in');
      throw error;
    }
  };

  /**
   * Create a new user account
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User object
   */
  const register = async (email, password) => {
    try {
      setAuthError(null);
      return await signUp(email, password);
    } catch (error) {
      setAuthError(error.message || 'Failed to create account');
      throw error;
    }
  };

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setAuthError(null);
      await signOut();
    } catch (error) {
      setAuthError(error.message || 'Failed to sign out');
      throw error;
    }
  };

  return {
    user,
    loading,
    error: error || authError,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;