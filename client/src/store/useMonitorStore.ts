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
        set({ userMonitors: response.data.data });
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error !", error);
      toast.error("Something went wrong", { position: "bottom-right" });
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
        set({ currentMonitor: response.data.data });
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error !", error);
      toast.error("Something went wrong", { position: "bottom-right" });
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
        set({ currentMonitor: response.data.data });
      } else if (response.status != 200) {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error!", error);
      toast.error("Something went wrong", { position: "bottom-right" });
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

      if (response.status == 200) {
        set({
          pingData: response.data.pingData,
          averageLatency: response.data.avgLatency,
        });
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong", { position: "bottom-right" });
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
        return { success: true, message: "successfully deleted" };
      } else {
        return { success: false, message: response.data.error };
      }
    } catch (error) {
      console.log("error !", error);
      return { success: false, message: "Something went wrong" };
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
      if (response.status === 200) {
        set({
          heatMapData: response.data.pingData,
        });
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong", { position: "bottom-right" });
    } finally {
      set({ isLoadingHeatMapData: false });
    }
  },

  updateMonitorDetails: (
    statusCode: number,
    latency: number,
    timestamp: Date,
  ) => {
    set((state) => {
      const isUP = statusCode >= 200 && statusCode < 300;
      const newStatus: MonitorStatus = isUP == true ? "UP" : "DOWN";

      console.log("time is", timestamp);
      let updatedMonitor = state.currentMonitor;
      if (updatedMonitor) {
        updatedMonitor = {
          ...updatedMonitor,
          status: newStatus,
          lastChecked: timestamp,
          ...(updatedMonitor.status !== newStatus && {
            statusChangedAt: timestamp,
          }),
        };
      }

      const newPing = { timestamp, statusCode, latency };
      const updatedPingData = state.pingData
        ? [...state.pingData, newPing]
        : [newPing];

      return {
        currentMonitor: updatedMonitor,
        pingData: updatedPingData,
      };
    });
  },
});

const useMonitorStore = create<MonitorStoreType>(MonitorStore);
export default useMonitorStore;
