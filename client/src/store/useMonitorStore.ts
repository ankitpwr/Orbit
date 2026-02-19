import axios from "axios";
import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { MonitorState, MonitorAction, MonitorStatus } from "../lib/types";
import { toast } from "sonner";

type MonitorStoreType = MonitorAction & MonitorState;

const MonitorStore: StateCreator<MonitorStoreType> = (set) => ({
  isCreateMonitor: false,
  isLoadingMonitors: false,
  isLoadingCurrentMonitor: false,
  isChangingStatus: false,
  userMonitors: [],
  currentMonitor: null,

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
        set({ userMonitors: response.data.monitors });
      } else console.log("not 200 ", response.status);
    } catch (error) {
      console.log("error !", error);
    } finally {
      set({ isLoadingMonitors: false });
    }
  },

  fetchCurrentMonitor: async (id) => {
    set({ isLoadingCurrentMonitor: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/details/${id}`,
        { withCredentials: true },
      );

      if (response.status === 200) {
        set({ currentMonitor: response.data.details });
      } else console.log("could't fetch current monitor details");
    } catch (error) {
      console.log("error in current monitor", error);
    } finally {
      set({ isLoadingCurrentMonitor: false });
    }
  },

  changeStatus: async (id: string, status: MonitorStatus) => {
    set({ isLoadingCurrentMonitor: true });
    console.log("id is", id, "status is", status);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/change-status`,
        {
          status: status,
          monitorId: id,
        },
        { withCredentials: true },
      );
      if (response.status != 200) {
        toast.error("error", { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error!", error);
    } finally {
      set({ isLoadingCurrentMonitor: false });
    }
  },
});

const useMonitorStore = create<MonitorStoreType>(MonitorStore);

export default useMonitorStore;
