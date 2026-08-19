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
  // Bọc Route để kiểm tra đăng nhập và phân quyền
  const ProtectedRoute = ({ children, role }) => {
    // Đọc trực tiếp trong component để luôn lấy dữ liệu mới nhất
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES - Ai cũng vào được */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/organizerregister" element={<OrganizerRegister />} />

        {/* USER PROTECTED ROUTES - Bắt buộc ĐĂNG NHẬP */}
        <Route
          path="/event/:id/booking"
          element={
            <ProtectedRoute>
              <AutoBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:eventId/seatmap"
          element={
            <ProtectedRoute>
              <SeatMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/:id"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout-auto"
          element={
            <ProtectedRoute>
              <AutoCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:orderId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* ORGANIZER ROUTES - Yêu cầu role ORGANIZER */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute role="ORGANIZER">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute role="ORGANIZER">
              <OrganizerEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/event/:id"
          element={
            <ProtectedRoute role="ORGANIZER">
              <OrganizerEventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/event/edit/:id"
          element={
            <ProtectedRoute role="ORGANIZER">
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute role="ORGANIZER">
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/event/setup-tickets"
          element={
            <ProtectedRoute role="ORGANIZER">
              <SetupTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/confirm-event"
          element={
            <ProtectedRoute role="ORGANIZER">
              <ConfirmEvent />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/organizer/scan"
          element={
            <ProtectedRoute role="ORGANIZER">
              <ScanTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/revenue"
          element={
            <ProtectedRoute role="ORGANIZER">
              <OrganizerRevenue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/promotions"
          element={
            <ProtectedRoute role="ORGANIZER">
              <OrganizerPromotion />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES - Yêu cầu role ADMIN */}
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
            <ProtectedRoute role="ADMIN">
              <AdminUserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminCategories />
            </ProtectedRoute>
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
        <Route
          path="/admin/events/:id"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminEventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/revenue"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminRevenue />
            </ProtectedRoute>
          }
        />

        {/* 404 CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;