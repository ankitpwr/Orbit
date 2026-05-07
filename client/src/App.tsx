import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Monitors from "./pages/monitors";
import RequireAuth from "./components/require-auth";
import CreateMonitor from "./pages/create-monitor";
import MonitorDetails from "./pages/monitor-details";
import NotFound from "./pages/not-found";
import Incidents from "./pages/incidents";
import Settings from "./pages/settings";
import { ThemeProvider } from "./components/theme-provider";
import IncidentDetails from "./pages/incident-details";
import LandingPage from "./pages/landing-page";

function App() {
  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<Dashboard />}>
                <Route path="/dashboard/monitors" element={<Monitors />} />
                <Route path="/dashboard/incidents" element={<Incidents />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                <Route
                  path="/dashboard/incidents/:incidentId"
                  element={<IncidentDetails />}
                />

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
      </ThemeProvider>
    </>
  );
}

export default App;
