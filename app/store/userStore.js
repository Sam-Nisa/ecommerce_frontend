import { create } from 'zustand';
import { request } from '../util/request';

export const useUserStore = create((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/profile', 'GET');
      set({ user: res, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch user', loading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/users/${id}`, 'GET');
      set({ user: res, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch user', loading: false });
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/users', 'GET'); // ✅ Ensure endpoint matches your API
      set({ users: res, loading: false }); // ✅ Store list in `users`, not singular `user`
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch users',
        loading: false,
      });
    }
  },
  

  updateUser: async (id, updatedData) => {
    try {
      const data = await request(`/users/${id}`, 'POST', updatedData, {
        'Content-Type': 'multipart/form-data',
      });
      set({ user: data });
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Update failed');
    }
  }
  ,
  

  clearUser: () => set({ user: null, error: null }),
  clearUsers: () => set({ users: [], error: null }),
}));
