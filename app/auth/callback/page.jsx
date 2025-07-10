'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken } = useAuthStore();

useEffect(() => {
  async function handleAuth() {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    console.log('AuthCallbackPage token:', token);
    console.log('AuthCallbackPage error:', error);

    if (error) {
      console.error('Social auth failed:', error);
      router.push('/login?error=Authentication Failed');
      return;
    }

    if (token) {
      try {
        const user = await loginWithToken(token);
        if (user?.role === 'admin') {
          router.push(`/admin/${user.id}/dashboard`);
        } else if (user?.role === 'service_owner') {
          router.push(`/owner/${user.id}/service`);
        } else if (user?.role === 'user') {
          router.push(`/user/${user.id}/test`); // <-- Your new route here
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Login with token failed:', err);
        router.push('/');
      }
    } else {
      console.warn('No token found, redirecting to login');
      router.push('/login');
    }
  }

  handleAuth();
}, [searchParams?.toString()]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Authenticating, please wait...</p>
    </div>
  );
}
