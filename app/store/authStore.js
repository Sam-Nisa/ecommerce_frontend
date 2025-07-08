// store/authStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { request } from "../util/request";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
       setToken: (newToken) => set({ token: newToken }),
  getToken: () => get().token,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await request("/login", "POST", { email, password });
          const { user, token } = res || {};
          if (!user || !token) {
            throw new Error("Invalid login response. Please try again.");
          }
          set({ user, token });
          return { user, token };
        } catch (err) {
          const errorMsg =
            err?.response?.data?.error || err.message || "Login failed";
          set({ error: errorMsg });
          throw new Error(errorMsg);
        } finally {
          set({ loading: false });
        }
      },

register: async ({ name, email, password, confirmPassword }) => {
  set({ loading: true, error: null });
  try {
    console.log("Register payload:", { name, email, password, confirmPassword });

    const res = await request('/register', 'POST', {
      name,
      email,
      password,
      password_confirmation: confirmPassword,  // Laravel expects this key
    });

    const { user, token } = res || {};

    if (!user || !token) throw new Error('Invalid registration response');

    set({ user, token });

    return { user, token };
  } catch (err) {
    console.error("Register error response data:", err.response?.data);

    if (err.response?.data?.errors) {
      for (const [field, messages] of Object.entries(err.response.data.errors)) {
        console.error(`Validation error on ${field}: ${messages.join(', ')}`);
      }
    }

    const errorMsg = err?.response?.data?.message || err.message || 'Registration failed';

    set({ error: errorMsg });
    throw new Error(errorMsg);
  } finally {
    set({ loading: false });
  }
},




      logout: async () => {
        try {
          await request("/logout", "POST");
        } catch (err) {
          console.warn("Logout request failed:", err);
        } finally {
          set({ user: null, token: null });
        }
      },

      getToken: () => get().token,

      fetchUser: async () => {
        try {
          const res = await request("/me", "GET");
          set({ user: res.user });
        } catch (err) {
          console.error("Failed to fetch user:", err);
          get().logout();
        }
      },

      refreshToken: async () => {
        try {
          const res = await request("/refresh", "POST");
          set({ token: res.token });
          return res.token;
        } catch (err) {
          console.error("Token refresh failed:", err);
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
