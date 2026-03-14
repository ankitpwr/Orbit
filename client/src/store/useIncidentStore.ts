import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { Incident, IncidentAction, IncidentState } from "../lib/types";
import axios from "axios";

type IncidentStoreType = IncidentState & IncidentAction;

const IncidentStore: StateCreator<IncidentStoreType> = (set) => ({
  isLoadingIncidents: false,
  incidents: [],

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
            monitorName: i.monitor.name,
            url: i.monitor.url,
            startedAt: i.startedAt,
            resolvedAt: i.resolvedAt,
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
});

const useIncidentStore = create<IncidentStoreType>(IncidentStore);
export default useIncidentStore;
