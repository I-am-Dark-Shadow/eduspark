import { create } from 'zustand';
import api from '../services/api';

const useNotificationStore = create((set) => ({
  retakeCount: 0,
  viewCount: 0,
  paymentCount: 0,
  totalPending: 0,
  isLoading: true,
  fetchCounts: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/api/notifications/pending-counts');
      set({ ...data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch notification counts", error);
      set({ isLoading: false });
    }
  },
}));

export default useNotificationStore;