'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError(null);

  try {
    const { user } = await login(email, password);

    if (user.role === 'admin') {
      router.push(`/admin/${user.id}/dashboard`);
    } else if (user.role === 'owner') {
      router.push(`/owner/${user.id}/bookings`);
    } else if (user.role === 'user') {
      router.push(`/user/${user.id}/home`);
    }
  } catch (err) {
    setLocalError(err.message || 'Login failed');
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              disabled={loading}
            />
          </div>

          {(localError || error) && (
            <p className="text-red-500 text-sm mb-4">{localError || error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mb-6">
  <a
    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`}
    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
  >
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 48 48">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
    </svg>
    Sign in with Google
  </a>
</div>

<div className="text-center mb-6">
  <a
    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook/redirect`}
    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
  >
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 48 48">
      <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
    </svg>
    Login with Facebook
  </a>
</div>



      </div>
      
    </div>
  );
}
