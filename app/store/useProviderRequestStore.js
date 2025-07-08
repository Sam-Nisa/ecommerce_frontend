import { create } from 'zustand';
import { request } from '../util/request';

export const useProviderRequestStore = create((set, get) => ({
  requests: [],
  loading: false,
  error: null,

  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/admin/provider-requests', 'GET');
      set({ requests: data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Error fetching requests', loading: false });
    }
  },

  // New: Approve or Reject a provider request by ID
handleRequest: async (id, action) => {
  set({ loading: true, error: null });
  try {
    const statusValue = action === 'approve' ? 'approved' : 'rejected';
    await request(`/admin/provider-requests/${id}/handle`, 'POST', { status: statusValue });

    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, status: statusValue } : req
      ),
      loading: false,
    }));
  } catch (err) {
    set({ error: err.message || `Failed to ${action} request`, loading: false });
  }
},


}));
