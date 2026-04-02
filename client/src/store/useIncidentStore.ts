import { create } from "zustand";
import type { StateCreator } from "zustand";
import type {
  IncidentAction,
  IncidentState,
  IncidentStatus,
} from "../lib/types";
import axios from "axios";
import { toast } from "sonner";

type IncidentStoreType = IncidentState & IncidentAction;

const IncidentStore: StateCreator<IncidentStoreType> = (set) => ({
  isLoadingIncidents: false,
  isLoadingIncidentData: false,
  incidents: [],
  selectedIncident: null,

  fetchIncidents: async () => {
    set({ isLoadingIncidents: true, incidents: [] });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/incidents`,
        { withCredentials: true },
      );

      if (response.status == 200) {
        set({
          incidents: response.data.data.map((i: any) => ({
            incidentId: i.id,
            monitorName: i.monitor.name,
            url: i.monitor.url,
            startedAt: i.startedAt,
            currentStatus: i.currentStatus,
          })),
        });
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error !", error);
      toast.error("Something went wrongs", { position: "bottom-right" });
    } finally {
      set({ isLoadingIncidents: false });
    }
  },

  fetchIncidentData: async (id) => {
    set({ isLoadingIncidentData: false, selectedIncident: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/incidents/${id}`,
        { withCredentials: true },
      );
      if (response.status == 200) {
        set({
          selectedIncident: {
            monitorName: response.data.data.monitor.name,
            url: response.data.data.monitor.url,
            startedAt: response.data.data.startedAt,
            currentStatus: response.data.data.currentStatus,
            resolvedAt: response.data.data.resolvedAt,
            alertCount: response.data.data.alertCount,
            lastAlertSentAt: response.data.data.lastAlertSentAt,
          },
        });
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error !", error);
      toast.error("Something went wrong", { position: "bottom-right" });
    } finally {
      set({ isLoadingIncidents: false });
    }
  },

  updateStatus: async (status: IncidentStatus, id: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/monitor/incidents-update-status/${id}`,
        {
          status: status,
        },
        { withCredentials: true },
      );

      if (response.status == 200) {
        set({
          selectedIncident: {
            monitorName: response.data.data.monitor.name,
            url: response.data.data.monitor.url,
            startedAt: response.data.data.startedAt,
            currentStatus: response.data.data.currentStatus,
            resolvedAt: response.data.data.resolvedAt,
            alertCount: response.data.data.alertCount,
            lastAlertSentAt: response.data.data.lastAlertSentAt,
          },
        });
      } else {
        toast.error(response.data.error, { position: "bottom-right" });
      }
    } catch (error) {
      console.log("error !", error);
      toast.error("Something went wrong", { position: "bottom-right" });
    }
  },
});

const useIncidentStore = create<IncidentStoreType>(IncidentStore);
export default useIncidentStore;
