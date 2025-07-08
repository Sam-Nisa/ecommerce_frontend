import { create } from 'zustand';
import { request } from '../util/request';
import { useAuthStore } from './authStore'; // adjust path as needed

export const useUploadStore = create((set, get) => ({
  document: null,
  loading: false,
  message: '',

  setDocument: (file) => set({ document: file, message: '' }),

  reset: () => set({ document: null, loading: false, message: '' }),

  submitRequest: async () => {
    const { document } = get();

    if (!document) {
      set({ message: 'Error: Please select a file.' });
      return false;
    }

    set({ loading: true, message: '' });

    try {
      // Get token from your auth store (update if your auth store is named differently)
      const token = useAuthStore.getState().token;

      const formData = new FormData();
      formData.append('document', document);

      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const data = await request('/provider-requests', 'POST', formData, {
        headers,
      });

      set({ loading: false, message: data?.message || 'Upload successful!', document: null });
      return true;
    }catch (err) {
  const errorMessage =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    'Upload failed';

  set({
    loading: false,
    message: 'Error: ' + errorMessage,
  });
  return false;
}
  },
}));
