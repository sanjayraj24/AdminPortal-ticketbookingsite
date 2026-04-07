import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "../components/layout/UserLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Home from "../pages/user/Home";
// import Events from "../pages/user/Events";
import EventDetailsPage from "../pages/user/EventDetailsPage";
import SeatSelectionPage from "../pages/user/SeatSelectionPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import PaymentStatusPage from "../pages/user/PaymentStatusPage";
import TicketPage from "../pages/user/TicketPage";
import Login from "../pages/user/Login";
import Signup from "../pages/user/Signup";
import MyBookings from "../pages/user/MyBookings";

import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import AdminEvents from "../pages/admin/AdminEvents";
import CreateEvent from "../pages/admin/CreateEvent";
import EditEvent from "../pages/admin/EditEvent";
import AdminBookings from "../pages/admin/AdminBookings";

import NotFound from "../pages/NotFound";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          {/* <Route path="events" element={<Events />} /> */}
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="events/:id/seats" element={<SeatSelectionPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment-status" element={<PaymentStatusPage />} />
          <Route path="ticket/:bookingId" element={<TicketPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          <Route
            path="my-bookings"
            element={
              <ProtectedRoute allowedRole="user">
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= ADMIN LOGIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ================= ADMIN ROUTES ================= */}
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        > */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="events/new" element={<CreateEvent />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>

        {/* ================= NOT FOUND ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
