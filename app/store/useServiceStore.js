import { create } from 'zustand';
import { request } from '../util/request';

export const useServiceStore = create((set, get) => ({
  /* ────────── state ────────── */
  pages: [],    // initialize as empty array
  page: null,
  loading: false,
  error: null,
  success: false,

  // For admin dashboard, fetch all pages via admin API
  fetchAllPagesAdmin: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/admin/service-pages', 'GET');  // <-- correct admin API route
      set({ pages: data, loading: false });
    } catch (err) {
      set({ error: err?.response?.data?.message ?? err.message, loading: false });
    }
  },


fetchServicePage: async () => {
  set({ loading: true, error: null });
  try {
    const data = await request('/service-page', 'GET'); // data is response.data already
    console.log('✅ Response:', data);
    set({ page: data, loading: false });
  } catch (err) {
    console.error('❌ Error:', err);
    set({
      page: null,
      loading: false,
      error:
        err?.response?.data?.message || err?.message || 'Failed to fetch service page',
    });
  }
},
  

 resetStatus: () => set({ error: null, success: false }),
 
}));

export default useServiceStore;
