// pages/verify-email.jsx or /verify-email.js
'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function VerifyEmail() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resendVerificationEmail, error } = useAuthStore();

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    try {
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch {
      setMessage('Failed to resend verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Verify Your Email</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Thanks for registering! We've sent a verification link to your email.
          <br />
          Please check your inbox and click the link to activate your account.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Didn't receive the email? Check your spam or junk folder.
        </p>

        {message && (
          <p className={`mb-4 text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleResend}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </button>
      </div>
    </div>
  );
}
