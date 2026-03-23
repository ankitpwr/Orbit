import axios from "axios";
import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { AuthAction, AuthState } from "../lib/types";

type AuthStoreType = AuthState & AuthAction;
const AuthStore: StateCreator<AuthStoreType> = (set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/me`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        set({ isAuthenticated: true, user: response.data.user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.log("error ! ", error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );
      if (response.status == 200) {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.log("error!", error);
    }
  },
});

const useAuthStore = create<AuthStoreType>(AuthStore);
export default useAuthStore;
