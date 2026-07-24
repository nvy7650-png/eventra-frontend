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
import TicketDetail from "./pages/TicketDetail";
import ScanTicket from "./pages/ScanTicket";
import AdminEvents from "./pages/AdminEvents";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminCategories from "./pages/AdminCategories";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrganizerRevenue from "./pages/OrganizerRevenue";
import OrganizerPromotion from "./pages/OrganizerPromotion";
import AutoBooking from "./pages/AutoBooking";
import AutoCheckout from "./pages/AutoCheckout";
import ForgotPassword from "./pages/ForgotPassword";
import AdminOrders from "./pages/AdminOrders";
import AdminRevenue from "./pages/AdminRevenue";

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

        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
  path="/events"
  element={<Events />}
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

        <Route
  path="/admin/users"
  element={
    <ProtectedRoute role="ADMIN">
      <AdminUsers />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users/:id"
  element={
    <AdminUserDetail />
  }
/>

<Route
  path="/my-orders"
  element={<MyOrders />}
/>

<Route
  path="/admin/categories"
  element={<AdminCategories />}
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

<Route
  path="/admin/events"
  element={
    <ProtectedRoute role="ADMIN">
      <AdminEvents />
    </ProtectedRoute>
  }
/>

{/* ADMIN EVENT DETAIL */}
<Route
path="/admin/events/:id"
element={ <ProtectedRoute role="ADMIN"> <AdminEventDetail /> </ProtectedRoute>
}
/>

<Route
  path="/organizer/scan"
  element={
    <ProtectedRoute role="ORGANIZER">
      <ScanTicket />
    </ProtectedRoute>
  }
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

<Route
  path="/ticket/:id"
  element={<TicketDetail />}
/>

<Route
  path="/profile"
  element={<Profile />}
/>

<Route
  path="/payment-success"
  element={
    <PaymentSuccess />
  }
/>

<Route
  path="/organizer/revenue"
  element={<OrganizerRevenue />}
/>

<Route
  path="/organizer/promotions"
  element={<OrganizerPromotion />}
/>

<Route
  path="/event/:id/booking"
  element={
    <ProtectedRoute>
      <AutoBooking />
    </ProtectedRoute>
  }
/>

<Route
  path="/checkout-auto"
  element={
    <AutoCheckout />
  }
/>

<Route
  path="/admin/orders"
  element={<AdminOrders />}
/>

<Route
  path="/admin/revenue"
  element={<AdminRevenue />}
/>
      </Routes>


    </BrowserRouter>

  );

}

export default App;
