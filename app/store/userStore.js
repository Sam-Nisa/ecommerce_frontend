import { create } from 'zustand';
import { request } from '../util/request';

export const useUserStore = create((set, get) => ({
  user: null,
  users: [],           // Initialize users state here
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/user', 'GET');
      set({ user: res, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch user', loading: false });
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/admin/users', 'GET');
      set({ users: res, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch users', loading: false });
    }
  },
  

  clearUser: () => set({ user: null, error: null }),
  clearUsers: () => set({ users: [], error: null }),
}));
