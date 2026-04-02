import axios from "axios";
import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { AuthAction, AuthState } from "../lib/types";

type AuthStoreType = AuthState & AuthAction;
const AuthStore: StateCreator<AuthStoreType> = (set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/me`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        console.log("user is authorized");
        set({ isAuthenticated: true, user: response.data.data });
        return { success: true, message: "successfully checked" };
      } else {
        set({ isAuthenticated: false, user: null });
        return { success: false, message: response.data.error };
      }
    } catch (error) {
      console.log("error ! ", error);
      set({ isAuthenticated: false, user: null });
      return { success: false, message: "Something went wrong" };
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
        return { success: true, message: "successfully logout" };
      } else {
        console.log(response.data.error);
        return { success: false, message: response.data.error };
      }
    } catch (error) {
      console.log("error!", error);
      return { success: false, message: "Something went wrong" };
    }
  },
});

const useAuthStore = create<AuthStoreType>(AuthStore);
export default useAuthStore;
