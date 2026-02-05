import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleAuthWrapper from "./components/ui/google-auth-wrapper";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<GoogleAuthWrapper />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
