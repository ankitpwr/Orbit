import axios from "axios";
import { create } from "zustand";
import type { StateCreator } from "zustand";

type MonitorStatus = "UP" | "DOWN";
interface User {
  name: string;
  email: string;
  createdAt: Date;
  picture: string;
}
interface UserMonitors {
  url: string;
  id: string;
  name: string;
  createdAt: Date;
  status: MonitorStatus;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  userMonitors: UserMonitors[];
  isLoadingMonitors: boolean;
}
interface AuthAction {
  checkAuth: () => Promise<void>;
  fetchUserMonitors: () => Promise<void>;
}

type AuthStoreType = AuthState & AuthAction;
const AuthStore: StateCreator<AuthStoreType> = (set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  userMonitors: [],
  isLoadingMonitors: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/me`,
        { withCredentials: true },
      );
      console.log("data", response.data);
      if (response.status === 200) {
        set({ isAuthenticated: true, user: response.data });
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

  fetchUserMonitors: async () => {
    set({ isLoadingMonitors: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/monitor`,
        { withCredentials: true },
      );
      console.log("user monitors ", response.data);
      set({ userMonitors: response.data });
    } catch (error) {
    } finally {
      set({ isLoadingMonitors: false });
    }
  },
});

const useAuthStore = create<AuthStoreType>(AuthStore);
export default useAuthStore;
