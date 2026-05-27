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

import OrganizerEvents from "./pages/OrganizerEvents";

import AdminDashboard from "./pages/AdminDashboard";

import CreateEvent from "./pages/CreateEvent";

import SetupTickets from "./pages/SetupTickets";

import OrganizerPayment from "./pages/OrganizerPayment";

function App() {

  // GET USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ============================
  // PROTECTED ROUTE
  // ============================

  const ProtectedRoute = ({
    children,
    role,
  }) => {

    // NOT LOGIN
    if (!user) {

      return (
        <Navigate
          to="/login"
          replace
        />
      );

    }

    // WRONG ROLE
    if (
      role &&
      user.role !== role
    ) {

      return (
        <Navigate
          to="/"
          replace
        />
      );

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
          element={
            <OrganizerRegister />
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

        {/* ORGANIZER EVENTS */}
        <Route
          path="/organizer/events"
          element={

            <ProtectedRoute role="ORGANIZER">

              <OrganizerEvents />

            </ProtectedRoute>

          }
        />

        {/* CREATE EVENT */}
        <Route
          path="/organizer/create-event"
          element={

            <ProtectedRoute role="ORGANIZER">

              <CreateEvent />

            </ProtectedRoute>

          }
        />

        {/* STEP 2 */}
        <Route
          path="/organizer/event/:id/tickets"
          element={

            <ProtectedRoute role="ORGANIZER">

              <SetupTickets />

            </ProtectedRoute>

          }
        />

        {/* STEP 3 */}
        <Route
          path="/organizer/event/:id/payment"
          element={

            <ProtectedRoute role="ORGANIZER">

              <OrganizerPayment />

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

        {/* 404 */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;