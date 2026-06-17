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

import EventDetail from "./pages/EventDetail";

import EditEvent from "./pages/EditEvent";

import AdminDashboard from "./pages/AdminDashboard";

import CreateEvent from "./pages/CreateEvent";

import SetupTickets from "./pages/SetupTickets";

import ConfirmEvent from "./pages/ConfirmEvent";

import OrganizerTickets from "./pages/OrganizerTickets";
import OrganizerTicketDetail from "./pages/OrganizerTicketDetail";
import AdminEventDetail from "./pages/AdminEventDetail";
import SeatMap from "./pages/SeatMap";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

import MyTickets from "./pages/MyTickets";

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

        <Route
  path="/organizer/tickets"
  element={
    <ProtectedRoute role="ORGANIZER">
      <OrganizerTickets />
    </ProtectedRoute>
  }
/>

        <Route
          path="/organizer/tickets/:eventId"
          element={
            <ProtectedRoute role="ORGANIZER">
              <OrganizerTicketDetail />
            </ProtectedRoute>
          }
        />

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/event/:id"
          element={<EventDetail />}
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

        
      {/* ADMIN DASHBOARD */}
<Route
path="/admin/dashboard"
element={ <ProtectedRoute role="ADMIN"> <AdminDashboard /> </ProtectedRoute>
}
/>

{/* ADMIN EVENT DETAIL */}
<Route
path="/admin/events/:id"
element={ <ProtectedRoute role="ADMIN"> <AdminEventDetail /> </ProtectedRoute>
}
/>

<Route
  path="/event/:eventId/seatmap"
  element={<SeatMap />}
/>

<Route
  path="/event/:eventId/seatmap"
  element={<SeatMap />}
/>

<Route
  path="/checkout"
  element={<Checkout />}
/>

<Route
  path="/payment/:orderId"
  element={<Payment />}
/>

<Route
  path="/my-tickets"
  element={<MyTickets />}
/>

      </Routes>


    </BrowserRouter>

  );

}

export default App;
