import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleAuthWrapper from "./components/google-auth-wrapper";
import Dashboard from "./pages/dashboard";
import Monitors from "./pages/monitors";
import RequireAuth from "./components/require-auth";
import CreateMonitor from "./pages/create-monitor";
import MonitorDetails from "./pages/monitor-details";
import NotFound from "./pages/not-fount";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore";
import Incidents from "./pages/incidents";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<GoogleAuthWrapper />} />
          <Route element={<RequireAuth />}>
            <Route element={<Dashboard />}>
              <Route path="/dashboard/monitors" element={<Monitors />} />
              <Route path="/dashboard/incidents" element={<Incidents />} />

              <Route
                path="/dashboard/monitors/new"
                element={<CreateMonitor />}
              />
              <Route
                path="/dashboard/monitors/:id"
                element={<MonitorDetails />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
