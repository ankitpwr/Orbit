import axios from "axios";
import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { MonitorState, MonitorAction } from "../lib/types";

type MonitorStoreType = MonitorAction & MonitorState;

const MonitorStore: StateCreator<MonitorStoreType> = (set) => ({
  isCreateMonitor: false,
  isLoadingMonitors: false,
  userMonitors: [],

  setIsCreateMonitor: (newIsCreateMonitor: boolean) =>
    set({ isCreateMonitor: newIsCreateMonitor }),

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

const useMonitorStore = create<MonitorStoreType>(MonitorStore);

export default useMonitorStore;
