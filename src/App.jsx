import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import OrganizerRegister from "./pages/OrganizerRegister";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import Login from "./pages/Login";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/organizerregister"
          element={<OrganizerRegister />}
        />

        <Route
          path="/organizer/dashboard"
          element={<OrganizerDashboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;