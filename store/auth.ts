import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setIsLoading: (loading: boolean) => void;
}

// Mock database of users
const MOCK_USERS: Record<string, { password: string; user: User }> = {};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const lowerEmail = email.toLowerCase();
          const userRecord = MOCK_USERS[lowerEmail];

          if (!userRecord || userRecord.password !== password) {
            throw new Error('Invalid email or password');
          }

          const token = `token_${Math.random().toString(36).substring(2)}`;

          set({
            user: userRecord.user,
            token,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      register: async (email, password, name) => {
        try {
          set({ isLoading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const lowerEmail = email.toLowerCase();

          if (MOCK_USERS[lowerEmail]) {
            throw new Error('Email already in use');
          }

          const newUser: User = {
            id: `user_${Math.random().toString(36).substring(2)}`,
            email: lowerEmail,
            name,
          };

          MOCK_USERS[lowerEmail] = {
            password,
            user: newUser,
          };

          const token = `token_${Math.random().toString(36).substring(2)}`;

          set({
            user: newUser,
            token,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
