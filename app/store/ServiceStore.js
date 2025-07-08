import { create } from "zustand";
import { request } from "../util/request";

export const useServiceStore = create((set, get) => ({
  page: null,
  loading: false,
  error: null,
  success: false,
  menus: [],

  fetchServicePage: async () => {
    set({ loading: true, error: null });
    try {
      // The API response is { data: { ...page_object... } }
      const response = await request("/service-page", "GET");

      // THE FIX: We must get the page object from *inside* the 'data' key.
      set({ page: response.data, loading: false });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        set({ page: null, loading: false, error: null });
      } else {
        set({
          page: null,
          error: "Failed to load page data. Please refresh.",
          loading: false,
        });
      }
    }
  },

  savePage: async (payload) => {
    set({ loading: true, error: null, success: false });
    try {
      const { data } = await request("/service-page", "POST", payload);
      set({ page: data, loading: false, success: true });
      return data;
    } catch (err) {
      let errorMessage = "An unknown error occurred.";
      if (err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors)[0][0];
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      set({ error: errorMessage, loading: false, success: false });
      throw err;
    }
  },

  // create menu for a given servicePageId
  createMenu: async (userId, menuData) => {
    // menuData should be an object like { name: "Menu Name", slug: "optional-slug" }
    set({ loading: true, error: null });
    try {
      const newMenu = await request(
        `/service-page/${userId}/menus`,
        "POST",
        menuData
      );
      // Append the new menu to the menus array in state
      const currentMenus = get().menus;
      set({ menus: [...currentMenus, newMenu], loading: false });
      return newMenu; // optionally return the created menu
    } catch (err) {
      set({ error: err.response?.data ?? err.message, loading: false });
      throw err;
    }
  },

  fetchMenus: async (user) => {
    set({ loading: true, error: null });

    try {
      // hits /api/users/{id}/menus  (Route::apiResource('users.menus'…) )
      const res = await request(`/service-page/users/${user}/menus`, "GET");
      console.log(res);

      set({ menus: res, loading: false });
    } catch (err) {
      set({ error: err.response?.data ?? err.message, loading: false });
    }
  },

  resetError: () => set({ error: null }),

  resetStatus: () => set({ error: null, success: false }),
}));
