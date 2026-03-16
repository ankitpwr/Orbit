//user types
export interface User {
  name: string;
  email: string;
  createdAt: Date;
  timezone: string;
  picture: string;
}
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}
export interface AuthAction {
  checkAuth: () => Promise<void>;
}

//monitors  types
export type MonitorStatus = "UP" | "DOWN" | "PAUSED";
export const TimeRange = {
  Day: 1,
  Week: 7,
  Month: 30,
} as const;
export type TimeRange = (typeof TimeRange)[keyof typeof TimeRange];

export interface UserMonitors {
  url: string;
  id: string;
  name: string;
  status: MonitorStatus;
}
export interface ping {
  timestamp: Date;
  statusCode: number;
  latency: number;
}
export interface CurrentMonitor {
  id: string;
  name: string;
  url: string;
  email: string;
  createdAt: Date;
  status: MonitorStatus;
  lastChecked: Date;
  statusChangedAt: Date;
}
export interface MonitorState {
  isCreateMonitor: boolean;
  isLoadingMonitors: boolean;
  isLoadingCurrentMonitor: boolean;
  isLoadingPingData: boolean;
  isLoadingHeatMapData: boolean;
  userMonitors: UserMonitors[];
  currentMonitor: CurrentMonitor | null;
  pingData: ping[] | null;
  heatMapData: ping[] | null;
  averageLatency: number;
}
export interface MonitorAction {
  setIsCreateMonitor: (newIsCreateMonitor: boolean) => void;
  fetchUserMonitors: () => Promise<void>;
  fetchCurrentMonitor: (id: string) => Promise<void>;
  changeStatus: (id: string, status: MonitorStatus) => Promise<void>;
  fetchPingData: (id: string, days: number) => Promise<void>;
  fetchHeatMapData: (id: string, days: number) => Promise<void>;
  deleteMonitor: (id: string) => Promise<void>;
}

//incident types
export type IncidentStatus = "OPEN" | "RESOLVED" | "ACKNOWLEDGED";
export interface Incident {
  monitorName: string;
  url: string;
  startedAt: Date;
  resolvedAt?: Date;
  currentStatus: IncidentStatus;
}
export interface IncidentState {
  isLoadingIncidents: boolean;
  incidents: Incident[];
}

export interface IncidentAction {
  fetchIncidents: () => Promise<void>;
}

//setting
export interface SettingState {
  updating: boolean;
}
export interface SettingActions {
  updateUserSetting: (name: string, timezone: string) => Promise<void>;
}
