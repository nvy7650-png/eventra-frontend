import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import OrganizerRegister from "./pages/OrganizerRegister";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

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

        <Route
  path="/user/dashboard"
  element={<UserDashboard />}
/>

<Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>

      </Routes>

    </BrowserRouter>

  );

}

export default App;