/**
 * SignIn.jsx
 * 
 * User sign-in form component that handles email/password authentication
 */
import React, { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const SignIn = ({ onSuccess }) => {
  const { signIn } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle form submission for sign in
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await signIn(email, password);
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      console.error('Sign in error:', err);
      
      // Provide user-friendly error messages based on Firebase error codes
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError(err.message || 'An error occurred during sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-800 rounded-md flex items-center text-red-400">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-black font-medium ${
                loading 
                  ? 'bg-yellow-600 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="#signup" className="text-yellow-500 hover:text-yellow-400">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
