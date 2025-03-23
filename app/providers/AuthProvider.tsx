// app/providers/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseReady } from '@/lib/firebase';
import { UserSettings } from '@/types/database.types';

interface AuthContextType {
  user: User | null;
  userSettings: UserSettings | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  refreshUserSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user settings from Firestore
  const fetchUserSettings = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserSettings(userDoc.data() as UserSettings);
      } else {
        // Create default user settings if they don't exist
        const defaultSettings: UserSettings = {
          userId,
          defaultAuthorityThreshold: 70,
          trustedDomains: [],
          excludedDomains: [],
          defaultUpdateFrequency: 'daily',
          notificationPreferences: {
            email: true,
            app: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await setDoc(userDocRef, defaultSettings);
        setUserSettings(defaultSettings);
      }
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError('Error loading user settings');
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const initAuth = async () => {
      // Ensure Firebase is initialized before setting up listeners
      await firebaseReady;
      
      return onAuthStateChanged(auth, async (authUser) => {
        setLoading(true);
        
        if (authUser) {
          setUser(authUser);
          await fetchUserSettings(authUser.uid);
        } else {
          setUser(null);
          setUserSettings(null);
        }
        
        setLoading(false);
      });
    };

    const unsubscribe = initAuth();
    
    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe.then(fn => fn());
      }
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Refresh user settings
  const refreshUserSettings = async () => {
    if (user) {
      await fetchUserSettings(user.uid);
    }
  };

  const value = {
    user,
    userSettings,
    loading,
    error,
    signUp,
    signIn,
    logOut,
    refreshUserSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}