import { create } from 'zustand';

// نوع بيانات المستخدم
type User = {
  email: string;
  token: string;
};

// حالة الـ auth
type AuthState = {
  user: User | null;
  login: (email: string, token: string) => void;
  logout: () => void;
};

// إنشاء الـ store
export const useAuthStore = create<AuthState>((set) => ({
  user: null, // القيمة الابتدائية: لا يوجد مستخدم
  login: (email, token) => set({ user: { email, token } }), // تسجيل الدخول
  logout: () => set({ user: null }), // تسجيل الخروج
}));