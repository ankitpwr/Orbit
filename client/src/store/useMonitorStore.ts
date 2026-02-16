import { create } from "zustand";
import type { StateCreator } from "zustand";

interface MonitorState {
  isCreateMonitor: boolean;
}

interface MonitorAction {
  setIsCreateMonitor: (newIsCreateMonitor: boolean) => void;
}

type MonitorStoreType = MonitorAction & MonitorState;

const MonitorStore: StateCreator<MonitorStoreType> = (set) => ({
  isCreateMonitor: false,
  setIsCreateMonitor: (newIsCreateMonitor: boolean) =>
    set({ isCreateMonitor: newIsCreateMonitor }),
});

const useMonitorStore = create<MonitorStoreType>(MonitorStore);

export default useMonitorStore;
