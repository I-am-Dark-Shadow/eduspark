import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      updateProfile: (updatedData) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedData } : null
      })),
    }),
    {
      name: 'auth-storage', // name of the item in storage (must be unique)
    }
  )
);

export default useAuthStore;