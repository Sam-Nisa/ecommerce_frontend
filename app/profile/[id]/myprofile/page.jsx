'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../../store/userStore';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
    const { id } = useParams();  
  const { user, loading, error, fetchUserById } = useUserStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);  // call the store method with id param here
    }
  }, [id, fetchUserById]);




  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
      <div className="flex items-center space-x-4">
      {user.profile_image_url ? (
  <img
    src={user.profile_image_url}
    alt="User Avatar"
    className="h-24 w-24 rounded-full object-cover"
  />
) : (
  <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
    {user.name?.[0].toUpperCase() ?? '?'}
  </div>
)}



        <div>
          <p className="text-lg font-medium">{user.name || 'Unknown User'}</p>
          <p className="text-gray-600">{user.email || 'No email provided'}</p>
          <p className="text-gray-500 text-sm">Role: {user.role || 'User'}</p>
        </div>
      </div>
    </div>
  );
}
