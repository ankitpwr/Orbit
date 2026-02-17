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
      if (response.status === 200) {
        console.log("200 status");
        set({ userMonitors: response.data.monitors });
      } else console.log("not 200 ", response.status);
    } catch (error) {
      console.log("error !", error);
    } finally {
      set({ isLoadingMonitors: false });
    }
  },
});

const useMonitorStore = create<MonitorStoreType>(MonitorStore);

export default useMonitorStore;
