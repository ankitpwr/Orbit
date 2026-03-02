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
  isLoadingPingData: false,
  isLoadingHeatMapData: false,
  userMonitors: [],
  currentMonitor: null,
  pingData: null,
  heatMapData: null,
  averageLatency: 0,

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
    set({
      isLoadingCurrentMonitor: true,
      currentMonitor: null,
      averageLatency: 0,
      pingData: [],
    });

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
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/change-status`,
        {
          status: status,
          monitorId: id,
        },
        { withCredentials: true },
      );
      if (response.status == 200) {
        set({ currentMonitor: response.data.updatedData });
      } else if (response.status != 200) {
        console.log(response.data.error);
        toast.error("error", { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error!", error);
    } finally {
      set({ isLoadingCurrentMonitor: false });
    }
  },

  fetchPingData: async (id: string, days: number) => {
    set({ isLoadingPingData: true, pingData: [], averageLatency: 0 });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/ping-data/${id}?days=${days}`,
        { withCredentials: true },
      );

      if (response.status != 200) {
        console.log("error ", response.data.error);
        toast.error("error", { position: "bottom-right" });
      }

      set({
        pingData: response.data.pingData,
        averageLatency: response.data.avgLatency,
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isLoadingPingData: false });
    }
  },

  deleteMonitor: async (id: string) => {
    set({ isLoadingCurrentMonitor: true });
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/remove/${id}`,
        { withCredentials: true },
      );
      if (response.status == 200) {
        toast.success(response.data.message);
      } else {
        toast.success(response.data.error);
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ isCreateMonitor: false });
    }
  },

  fetchHeatMapData: async (id: string, days: number) => {
    set({ isLoadingHeatMapData: true, heatMapData: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/ping-data/${id}?days=${days}`,
        { withCredentials: true },
      );

      if (response.status != 200) {
        console.log("error ", response.data.error);
        toast.error("error", { position: "bottom-right" });
      }

      set({
        heatMapData: response.data.pingData,
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isLoadingHeatMapData: false });
    }
  },
});

const useMonitorStore = create<MonitorStoreType>(MonitorStore);
export default useMonitorStore;
