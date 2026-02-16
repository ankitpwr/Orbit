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
export interface MonitorState {
  isCreateMonitor: boolean;
  isLoadingMonitors: boolean;
  userMonitors: UserMonitors[];
}
export type MonitorStatus = "UP" | "DOWN";
export interface UserMonitors {
  url: string;
  id: string;
  name: string;
  createdAt: Date;
  status: MonitorStatus;
}
export interface MonitorAction {
  setIsCreateMonitor: (newIsCreateMonitor: boolean) => void;
  fetchUserMonitors: () => Promise<void>;
}
