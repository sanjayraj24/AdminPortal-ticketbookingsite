import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

useEffect(() => {
  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes, usersRes] = await Promise.all([
        fetch("https://adminportal-ticketbookingsite.onrender.com/events"),
        fetch("https://adminportal-ticketbookingsite.onrender.com/booking"),
        fetch("https://adminportal-ticketbookingsite.onrender.com/users"),
      ]);

      if (!eventsRes.ok || !bookingsRes.ok || !usersRes.ok) {
        throw new Error("Failed to load dashboard data.");
      }

      const [eventsData, bookingsData, usersData] = await Promise.all([
        eventsRes.json(),
        bookingsRes.json(),
        usersRes.json(),
      ]);

      setEvents(eventsData);
      setBookings(bookingsData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



  const totalRevenue = useMemo(
    () => bookings.reduce((sum, item) => sum + (item.paymentStatus === "paid" ? Number(item.amount || 0) : 0), 0),
    [bookings]
  );

  const ticketsSold = useMemo(
    () => bookings.reduce((sum, item) => sum + (Array.isArray(item.seats) ? item.seats.length : Number(item.seats || 0)), 0),
    [bookings]
  );

  const activeEvents = useMemo(
    () => events.filter((item) => item.status === "published").length,
    [events]
  );

  const newUsers = users.length;

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
        .slice(0, 4),
    [bookings]
  );

  const revenueByEvent = useMemo(() => {
    const totals = events.map((event) => {
      const revenue = bookings
        .filter((booking) => booking.eventId === event.id && booking.paymentStatus === "paid")
        .reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

      return {
        title: event.title,
        revenue,
      };
    });

    return totals.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [events, bookings]);

  const maxRevenue = Math.max(...revenueByEvent.map((item) => item.revenue), 1);

  const userName = (userId) => users.find((user) => user.id === userId)?.name || "Guest";
  const eventTitle = (eventId) => events.find((event) => event.id === eventId)?.title || "Unknown event";

  const handleCreateEvent = () => navigate("/admin/events/new");
  const handleExportData = () => {
    const payload = {
      events,
      bookings,
      users,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dashboard-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };



  const handleViewAllBookings = () => navigate("/admin/bookings");

  if (loading) {
    return (
      <div className="rounded-4xl border border-slate-800 bg-[#091124] p-8 text-center text-white shadow-2xl shadow-black/20">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-4xl border border-rose-500 bg-[#2b111a] p-8 text-center text-rose-200 shadow-2xl shadow-black/20">
        <p className="text-lg font-semibold">Unable to load dashboard</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, caption: "+12.5% from last week" },
    { label: "Tickets Sold", value: ticketsSold.toLocaleString(), caption: "+8.2% since yesterday" },
    { label: "Active Events", value: activeEvents.toString(), caption: "Live now" },
    { label: "New Users", value: newUsers.toString(), caption: "+6.1% new signups" },
  ];

  const actions = [
    { label: "Create New Event", description: "Launch a new event listing.", accent: true, action: handleCreateEvent },
    { label: "Export Data", description: "Download sales and booking reports.", action: handleExportData },

  ];

  return (
    <div className="space-y-6">
      <div className={`rounded-4xl p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5 ${isDark ? "bg-[#0d1122]" : "bg-white"}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={`text-sm uppercase tracking-[0.3em] ${isDark ? "text-white" : "text-cyan-700/80"}`}>Admin Dashboard</p>
            <h2 className={`mt-3 text-3xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Welcome back, Admin</h2>
            <p className={`mt-2 text-sm ${isDark ? "text-white" : "text-slate-600"}`}>Overview of event bookings and revenue.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className={`rounded-3xl border p-5 shadow-xl transition hover:-translate-y-1 ${isDark ? "border-slate-800 bg-[#091123]" : "border-slate-200 bg-white"}`}>
            <p className={`text-sm uppercase tracking-[0.25em] ${isDark ? "text-white" : "text-slate-500"}`}>{item.label}</p>
            <p className={`mt-4 text-3xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{item.value}</p>
            <p className={`mt-2 text-sm ${isDark ? "text-white" : "text-slate-600"}`}>{item.caption}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.65fr_0.95fr]">
        <div className={`rounded-4xl p-6 shadow-2xl transition ${isDark ? "border border-slate-800 bg-[#0d1122]" : "border border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Revenue per Event</h3>
              <p className={`mt-1 text-sm ${isDark ? "text-white" : "text-slate-600"}`}>Revenue from the last bookings.</p>
            </div>
            <button className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isDark ? "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700" : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              Last 30 Days
            </button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {revenueByEvent.map((item, index) => {
              const heightPercent = Math.max(20, Math.round((item.revenue / maxRevenue) * 100));
              const barColors = ["bg-cyan-500", "bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-fuchsia-500"];
              return (
                <div key={item.title} className="flex flex-col items-center gap-3 text-center">
                  <div className={`h-44 w-full rounded-3xl ${barColors[index % barColors.length]} opacity-90`} style={{ height: `${heightPercent}%` }} />
                  <span className={`text-xs uppercase tracking-[0.35em] ${isDark ? "text-white" : "text-slate-500"}`}>{item.title}</span>
                  <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>${item.revenue.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`space-y-4 rounded-4xl p-6 shadow-2xl transition ${isDark ? "border border-slate-800 bg-[#091124]" : "border border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Quick Actions</h3>
              <p className={`mt-1 text-sm ${isDark ? "text-white" : "text-slate-600"}`}>Stay on top of daily tasks.</p>
            </div>
          </div>
          <div className="space-y-3">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.action}
                className={`flex w-full flex-col items-start rounded-3xl border px-5 py-4 text-left text-sm font-semibold transition ${
                  action.accent
                    ? "border-cyan-600 bg-cyan-600/20 text-cyan-100 hover:bg-cyan-600/30 hover:text-white"
                    : isDark
                    ? "border-slate-700 bg-slate-900 text-white hover:border-slate-600 hover:bg-slate-800"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>{action.label}</span>
                <span className={`mt-1 text-xs ${isDark ? "text-white" : "text-slate-500"}`}>{action.description}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className={`rounded-4xl p-6 shadow-2xl transition ${isDark ? "border border-slate-800 bg-[#091124]" : "border border-slate-200 bg-white"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Recent Bookings</h3>
            <p className={`mt-1 text-sm ${isDark ? "text-white" : "text-slate-600"}`}>Latest orders from your ticketing dashboard.</p>
          </div>
          <button
            type="button"
            onClick={handleViewAllBookings}
            className="rounded-3xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            View All
          </button>
        </div>

        <div className={`mt-6 overflow-hidden rounded-3xl border ${isDark ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className={`${isDark ? "bg-slate-900 border-b border-slate-700" : "bg-slate-100"} text-xs uppercase tracking-[0.25em] ${isDark ? "text-white" : "text-slate-700"}`}>
              <tr>
                <th className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-400"}`}>User</th>
                <th className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-400"}`}>Event</th>
                <th className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-400"}`}>Seats</th>
                <th className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-400"}`}>Amount</th>
                <th className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-400"}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((item, index) => (
                <tr key={`${item.id || item.user}-${index}`} className={`border-t ${isDark ? "border-slate-700 hover:bg-slate-800/50" : "border-slate-200"}`}>
                  <td className={`px-6 py-4 font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{userName(item.userId)}</td>
                  <td className={`px-6 py-4 ${isDark ? "text-white" : "text-slate-900"}`}>{eventTitle(item.eventId)}</td>
                  <td className={`px-6 py-4 ${isDark ? "text-white" : "text-slate-900"}`}>{Array.isArray(item.seats) ? item.seats.length.toString().padStart(2, "0") : item.seats}</td>
                  <td className={`px-6 py-4 ${isDark ? "text-white" : "text-slate-900"}`}>${Number(item.amount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.paymentStatus === "paid" ? (isDark ? "bg-emerald-500/15 text-white" : "bg-emerald-100 text-emerald-800") : (isDark ? "bg-amber-500/15 text-white" : "bg-amber-100 text-amber-800")}`}>
                      {item.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
