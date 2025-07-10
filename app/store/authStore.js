import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { request } from "../util/request"; // Make sure request handles BASE_URL correctly

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // Login with email/password
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await request("/login", "POST", { email, password });
          const { user, token } = res || {};
          if (!user || !token) throw new Error("Invalid login response.");
          set({ user, token });
          return { user, token };
        } catch (err) {
          const msg = err?.message || "Login failed";
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      },

      // Register
      register: async (name, email, password, password_confirmation) => {
        set({ loading: true, error: null });
        try {
          const res = await request("/register", "POST", {
            name,
            email,
            password,
            password_confirmation,
          });
          const { user, token } = res || {};
          if (!user || !token) throw new Error("Invalid registration response.");
          set({ user, token });
          return { user, token };
        } catch (err) {
          const msg = err?.message || "Registration failed";
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      },

  //     // Fetch user using current token
  //    fetchUser: async () => {
  //   set({ loading: true, error: null });
  //   try {
  //     const res = await request('/profile', 'GET');
  //     set({ user: res, loading: false });
  //   } catch (err) {
  //     set({ error: err.message || 'Failed to fetch user', loading: false });
  //   }
  // },

      // Used in Social Login (Google callback)
      loginWithToken: async (token) => {
        set({ loading: true, error: null });
        try {
          set({ token }); // Save token temporarily

          const res = await request("/user", "GET", null, {
            Authorization: `Bearer ${token}`,
          });

          if (!res?.user) throw new Error("Failed to fetch user data.");
          set({ user: res.user });
          return res.user;
        } catch (err) {
          set({ user: null, token: null, error: err.message || "Login with token failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          await request("/logout", "POST", null, {
            Authorization: `Bearer ${get().token}`,
          });
        } catch (err) {
          console.warn("Logout API failed", err);
        }
        set({ user: null, token: null });
      },

      // Token getter
      getToken: () => get().token,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
