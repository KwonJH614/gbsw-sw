import { create } from 'zustand';
import type { Role, User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: Role) => boolean;
  isInstructor: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: (user, accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  setAccessToken: (token) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token });
  },

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ isLoading: loading }),

  hasRole: (role) => {
    const r = get().user?.role;
    if (!r) return false;
    if (r === 'ADMIN') return true;
    if (r === 'INSTRUCTOR') return role === 'STUDENT' || role === 'INSTRUCTOR';
    return r === role;
  },

  isInstructor: () => {
    const r = get().user?.role;
    return r === 'INSTRUCTOR' || r === 'ADMIN';
  },

  isAdmin: () => get().user?.role === 'ADMIN',
}));
