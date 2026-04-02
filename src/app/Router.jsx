import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/user/Home";
import EventDetailsPage from "../pages/user/EventDetailsPage";
import AdminLogin from "../pages/admin/AdminLogin";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/events/:id", element: <EventDetailsPage /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "*", element: <NotFound /> },
]);