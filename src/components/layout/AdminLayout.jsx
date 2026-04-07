import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useTheme from "../../hooks/useTheme";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4 11h6V4H4v7Zm0 9h6v-7H4v7Zm10 0h6v-4h-6v4Zm0-11v6h6V9h-6Z" />
      </svg>
    ),
  },
  {
    label: "Events",
    path: "/admin/events",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4 5h16v2H4V5Zm0 4h16v2H4V9Zm0 4h16v6H4v-6Z" />
      </svg>
    ),
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4h16V6H4v2Zm0 4h8v2H4v-2Zm0 4h8v2H4v-2Z" />
      </svg>
    ),
  },
];

const AdminLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showProfile, setShowProfile] = useState(false);

  const storedAdmin = typeof window !== "undefined" ? window.localStorage.getItem("adminUser") : null;
  const parsedAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

  const adminProfile = {
    name: parsedAdmin?.name || parsedAdmin?.username || "Admin User",
    role: parsedAdmin?.role === "admin" ? "Administrator" : parsedAdmin?.role || "Administrator",
    email: parsedAdmin?.email || "admin@example.com",
    phone: parsedAdmin?.phone || "(555) 123-4567",
    joined: parsedAdmin?.joined || "January 2025",
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#05080f] text-white" : "bg-slate-100 text-slate-900"}`}>
      <aside className={`fixed left-0 top-0 z-20 h-screen w-72 border-r px-6 py-8 flex flex-col ${isDark ? "bg-[#081025] border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="mb-10">
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? "text-white" : "text-cyan-700"}`}>Admin Portal</p>
          <div className="mt-4 flex items-center gap-3">
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Admin Portal</h1>
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`rounded-2xl border p-3 transition ${isDark ? "border-cyan-500 bg-cyan-900 text-cyan-100 hover:bg-cyan-800" : "border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4.5A.75.75 0 0 1 12 3.75Zm0 14.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Zm8.25-6.75a.75.75 0 0 1 .75.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75.75.75 0 0 1 .75-.75Zm-16.5 0a.75.75 0 0 1 .75.75H4.5a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75.75.75 0 0 1 .75-.75Zm12.03-6.28a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm-9.56 9.56a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm9.56 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.56-9.56a.75.75 0 0 1 0 1.06L4.22 6.28a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 0 1 .75.75c0 4.694-3.806 8.5-8.5 8.5a.75.75 0 0 1 0-1.5 7 7 0 1 0 7-7 .75.75 0 0 1 .75-.75Zm0 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-[0_0_0_1px_rgba(56,189,248,0.15)]"
                    : isDark
                    ? "text-white hover:bg-slate-800 hover:text-white"
                    : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`
              }
            >
              <span className={`${isDark ? "text-cyan-300" : "text-cyan-600"}`}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 rounded-3xl bg-surface-muted p-4 text-sm text-on-light shadow-sm">
          <p className="font-semibold text-on-light">Quick tips</p>
          <p className="mt-2 leading-6 text-on-light-muted">
            Use the sidebar to switch between dashboard, event management, and
            bookings.
          </p>
        </div>

        <div className="mt-auto rounded-3xl bg-surface p-4 text-sm text-on-light shadow-sm ring-1 ring-border">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white">
              {adminProfile.name.charAt(0)}
            </div>
            <div>
              <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{adminProfile.name}</p>
              <p className={`text-xs ${isDark ? "text-white" : "text-slate-500"}`}>{adminProfile.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowProfile(true)}
            className="mt-4 w-full rounded-3xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            View profile
          </button>
        </div>
      </aside>

      <div className="ml-72 flex-1">
        <main className="min-h-screen p-6">
          <Outlet />
        </main>
      </div>

      {showProfile ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl ring-1 ${isDark ? "bg-[#081025] border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${isDark ? "text-white" : "text-slate-500"}`}>Admin profile</p>
                <h2 className={`mt-2 text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{adminProfile.name}</h2>
                <p className={`mt-1 text-sm ${isDark ? "text-white" : "text-slate-500"}`}>{adminProfile.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className={`rounded-full border px-3 py-2 text-sm transition ${isDark ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800 hover:text-white" : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Email</p>
                <p className={`${isDark ? "text-white" : "text-slate-600"}`}>{adminProfile.email}</p>
              </div>
              <div>
                <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Phone</p>
                <p className={`${isDark ? "text-white" : "text-slate-600"}`}>{adminProfile.phone}</p>
              </div>
              <div>
                <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Member since</p>
                <p className={`${isDark ? "text-white" : "text-slate-600"}`}>{adminProfile.joined}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded-3xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                Close profile
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminLayout;
