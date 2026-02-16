import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleAuthWrapper from "./components/google-auth-wrapper";
import Dashboard from "./pages/dashboard";
import Monitors from "./pages/monitors";
import RequireAuth from "./components/require-auth";
import CreateMonitor from "./pages/create-monitor";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<GoogleAuthWrapper />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="/dashboard/monitors" element={<Monitors />} />
              <Route
                path="/dashboard/monitors/new"
                element={<CreateMonitor />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
