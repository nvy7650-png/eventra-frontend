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

import OrganizerEventDetail from "./pages/OrganizerEventDetail";

import EditEvent from "./pages/EditEvent";

import AdminDashboard from "./pages/AdminDashboard";

import CreateEvent from "./pages/CreateEvent";

import SetupTickets from "./pages/SetupTickets";

import ConfirmEvent from "./pages/ConfirmEvent";

function App() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const ProtectedRoute = ({
    children,
    role,
  }) => {

    if (!user) {

      return (
        <Navigate
          to="/login"
          replace
        />
      );

    }

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

        {/* ORGANIZER EVENT DETAIL */}
        <Route
          path="/organizer/event/:id"
          element={

            <ProtectedRoute role="ORGANIZER">

              <OrganizerEventDetail />

            </ProtectedRoute>

          }
        />

        {/* EDIT EVENT */}
        <Route
          path="/organizer/event/edit/:id"
          element={

            <ProtectedRoute role="ORGANIZER">

              <EditEvent />

            </ProtectedRoute>

          }
        />

        {/* STEP 1 */}
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
          path="/organizer/event/setup-tickets"
          element={

            <ProtectedRoute role="ORGANIZER">

              <SetupTickets />

            </ProtectedRoute>

          }
        />

        {/* STEP 3 */}
        <Route
          path="/organizer/confirm-event"
          element={

            <ProtectedRoute role="ORGANIZER">

              <ConfirmEvent />

            </ProtectedRoute>

          }
        />

        {/* ADMIN */}
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
