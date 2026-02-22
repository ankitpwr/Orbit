//user types
export interface User {
  name: string;
  email: string;
  createdAt: Date;
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

//monitors types
export type MonitorStatus = "UP" | "DOWN" | "PAUSED";
export interface UserMonitors {
  url: string;
  id: string;
  name: string;
  status: MonitorStatus;
}
export interface ping {
  id: string;
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
  userMonitors: UserMonitors[];
  currentMonitor: CurrentMonitor | null;
  pingData: ping[] | null;
  averageLatency: number;
}
export interface MonitorAction {
  setIsCreateMonitor: (newIsCreateMonitor: boolean) => void;
  fetchUserMonitors: () => Promise<void>;
  fetchCurrentMonitor: (id: string) => Promise<void>;
  changeStatus: (id: string, status: MonitorStatus) => Promise<void>;
  fetchPingData: (id: string, days: number) => Promise<void>;
}
