import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import OrganizerRegister from "./pages/OrganizerRegister";

import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {

  // GET USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // PROTECTED ROUTE
  const ProtectedRoute = ({
    children,
    role,
  }) => {

    // NOT LOGIN
    if (!user) {

      return <Navigate to="/login" />;

    }

    // WRONG ROLE
    if (role && user.role !== role) {

      return <Navigate to="/" />;

    }

    return children;

  };

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ORGANIZER REGISTER */}
        <Route
          path="/organizerregister"
          element={<OrganizerRegister />}
        />

        {/* USER DASHBOARD */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="USER">

              <UserDashboard />

            </ProtectedRoute>
          }
        />

        {/* ORGANIZER DASHBOARD */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute role="ORGANIZER">

              <OrganizerDashboard />

            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">

              <AdminDashboard />

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;