'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '../../../store/userStore';

export default function EditProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, fetchUserById, updateUser } = useUserStore();

  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', image: null });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      await updateUser(id, form);
      alert('Profile updated!');
      router.push(`/admin/${id}/dashboard`);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Profile Image */}
        {user.profile_image_url && (
          <img
            src={user.profile_image_url}
            alt="Profile"
            className="h-24 w-24 object-cover rounded-full mb-4"
          />
        )}

        {/* Name (Editable) */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Email (Read-Only) */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full p-2 border bg-gray-100 rounded text-gray-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
