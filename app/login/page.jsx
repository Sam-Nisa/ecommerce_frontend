'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Use Next.js Link for better navigation
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

// Icons for a polished look
import { 
  AtSymbolIcon, 
  LockClosedIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/solid';


/**
 * A reusable, animated alert component for authentication errors.
 */
function AuthAlert({ message }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 rounded-md bg-red-50 p-3 text-sm text-red-700"
    >
      <ExclamationCircleIcon className="h-5 w-5" />
      <span>{message}</span>
    </motion.div>
  );
}

export default function Login() {
  const { id } = useParams();
  const router = useRouter();
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // login resolves to { user, token }
    const { user } = await login(email, password);

    // Redirect based on role or flag
    if (user?.role === 'admin' || user?.is_admin) {
      router.push(`/admin/${user.id}/dashboard`);
    } else if (user?.role === 'service_owner' || user?.is_owner) {
      router.push(`/owner/${user.id}/service`);  // change this path as you want
    } else {
      router.push('/');
    }
  } catch (err) {
    console.error("Login failed:", err);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* App Logo/Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">YourAppName</h1>
          <p className="mt-2 text-lg text-gray-400">Welcome back! Please sign in.</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        >
          <AnimatePresence>
            {error && <AuthAlert message={error} />}
          </AnimatePresence>
          
          {/* Email Input with Icon */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AtSymbolIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input with Icon */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="sr-only">Password</label>
              {/* CORRECTED LINK #1 */}
              <Link 
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border-gray-300 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button with Loading Spinner */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </>
            ) : 'Sign In'}
          </button>
        </motion.form>

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{' '}
          {/* CORRECTED LINK #2 */}
          <Link 
            href="/register"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}