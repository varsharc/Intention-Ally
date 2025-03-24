/**
 * Authentication service for Intention-Ally
 * 
 * This module provides functions for managing user authentication state,
 * including tracking online status and user profiles.
 */
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { initFirebase } from './firebase';

// Initialize Firebase and get a Firestore instance
const db = initFirebase();

/**
 * Updates the user's profile in both Firebase Auth and Firestore
 * @param {Object} user - User object from Firebase Auth
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (user, profileData) => {
  try {
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    const { displayName, photoURL, ...otherData } = profileData;
    
    // Update auth profile data
    if (displayName || photoURL) {
      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      });
    }
    
    // Create or update the user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      // Update existing user document
      await updateDoc(userRef, {
        ...otherData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new user document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || user.email.split('@')[0],
        photoURL: photoURL || user.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        ...otherData
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Tracks user online status in Firestore
 * @param {Object} user - User object from Firebase Auth
 * @returns {Function} - Cleanup function to call on logout/unmount
 */
export const trackUserOnlineStatus = (user) => {
  if (!user) return () => {};
  
  const userStatusRef = doc(db, 'userStatus', user.uid);
  
  // Mark user as online
  const markOnline = () => {
    setDoc(userStatusRef, {
      online: true,
      lastSeen: serverTimestamp()
    }, { merge: true });
  };
  
  // Mark user as offline
  const markOffline = () => {
    setDoc(userStatusRef, {
      online: false,
      lastSeen: serverTimestamp()
    }, { merge: true });
  };
  
  // Update online status when page focus changes
  window.addEventListener('focus', markOnline);
  window.addEventListener('blur', markOffline);
  
  // Update online status on page load/reload
  markOnline();
  
  // Update online status when tab is closed or browser is exited
  window.addEventListener('beforeunload', markOffline);
  
  // Return cleanup function
  return () => {
    markOffline();
    window.removeEventListener('focus', markOnline);
    window.removeEventListener('blur', markOffline);
    window.removeEventListener('beforeunload', markOffline);
  };
};

/**
 * Check if user has admin privileges
 * @param {string} userId - User's ID
 * @returns {Promise<boolean>} - Whether user is an admin
 */
export const checkAdminStatus = async (userId) => {
  try {
    if (!userId) return false;
    
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) return false;
    
    const userData = userSnapshot.data();
    return userData.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Send a password reset email to the specified email address
 * @param {string} email - User's email address
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send an email verification to the currently signed-in user
 * @returns {Promise<void>}
 */
export const verifyEmail = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    await sendEmailVerification(user);
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

/**
 * Initialize auth state observer and on-mount/dismount user status tracking
 * @param {Function} setState - Function to update authentication state
 * @returns {Function} - Cleanup function to remove observers
 */
export const initAuthObserver = (setState) => {
  const auth = getAuth();
  let cleanupOnlineStatus = null;
  
  // Set up auth state observer
  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const isAdmin = await checkAdminStatus(user.uid);
      
      // Update user's last login timestamp
      try {
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error('Error updating last login:', error);
      }
      
      // Start tracking online status
      cleanupOnlineStatus = trackUserOnlineStatus(user);
      
      // Update state with user info
      setState({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          isAdmin
        },
        loading: false
      });
    } else {
      // User is signed out
      if (cleanupOnlineStatus) {
        cleanupOnlineStatus();
        cleanupOnlineStatus = null;
      }
      
      setState({
        user: null,
        loading: false
      });
    }
  });
  
  // Return cleanup function
  return () => {
    unsubscribeAuth();
    if (cleanupOnlineStatus) {
      cleanupOnlineStatus();
    }
  };
};

/**
 * Sign out the currently authenticated user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export default {
  updateUserProfile,
  trackUserOnlineStatus,
  checkAdminStatus,
  resetPassword,
  verifyEmail,
  initAuthObserver,
  logout
};
