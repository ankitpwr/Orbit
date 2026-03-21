import { create } from "zustand";
import type { StateCreator } from "zustand";
import type {
  Incident,
  IncidentAction,
  IncidentState,
  IncidentStatus,
} from "../lib/types";
import axios from "axios";

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
          incidents: response.data.incidents.map((i: any) => ({
            incidentId: i.id,
            monitorName: i.monitor.name,
            url: i.monitor.url,
            startedAt: i.startedAt,
            currentStatus: i.currentStatus,
          })),
        });
      } else console.log("could't fetch incidents");
    } catch (error) {
      console.log("error in current monitor", error);
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
            monitorName: response.data.incidentData.monitor.name,
            url: response.data.incidentData.monitor.url,
            startedAt: response.data.incidentData.startedAt,
            currentStatus: response.data.incidentData.currentStatus,
            resolvedAt: response.data.incidentData.resolvedAt,
            alertCount: response.data.incidentData.alertCount,
            lastAlertSentAt: response.data.incidentData.lastAlertSentAt,
          },
        });
      }
    } catch (error) {
      console.log("error !", error);
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
      }
      //error
    } catch (error) {
      console.log("error !", error);
    }
  },
});

const useIncidentStore = create<IncidentStoreType>(IncidentStore);
export default useIncidentStore;
