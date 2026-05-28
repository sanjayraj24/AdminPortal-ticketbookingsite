import React, { useEffect, useMemo, useState, useCallback } from "react";

import { useApi } from "../../hooks/useApi";
import {
  filterBookings,
  getTotalRevenue,
  getPendingAmount,
  getUserDisplayName,
} from "../../services/bookingService";

const BOOKING_PATH = "/bookings";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    paymentStatus: "",
    bookingStatus: "",
    eventSearch: "",
    startDate: "",
    endDate: "",
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const API_BASE_URL =
    "https://adminportal-ticketbookingsite.onrender.com";

  const { get, put, loading } = useApi(API_BASE_URL);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setError(null);

    try {
      const [bookingsData, usersData] = await Promise.all([
        get(BOOKING_PATH),
        get("/users"),
      ]);

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load data"
      );
    }
  };

  const openCancelModal = useCallback((booking) => {
    setError(null);
    setCancellingBooking(booking);
    setShowCancelModal(true);
  }, []);

  const closeCancelModal = () => {
    if (cancelLoading) return;

    setShowCancelModal(false);
    setCancellingBooking(null);
  };

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;

    setCancelLoading(true);
    setError(null);

    try {
      await put(`${BOOKING_PATH}/${cancellingBooking.id}`, {
        ...cancellingBooking,
        bookingStatus: "cancelled",
        paymentStatus: "refunded",
      });

      await loadData();
      closeCancelModal();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel booking"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const openDetailsModal = useCallback((booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  }, []);

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      paymentStatus: "",
      bookingStatus: "",
      eventSearch: "",
      startDate: "",
      endDate: "",
    });
  };

  const filteredBookings = useMemo(
    () => filterBookings(bookings, filters),
    [bookings, filters]
  );

  const totalRevenue = useMemo(
    () => getTotalRevenue(filteredBookings),
    [filteredBookings]
  );

  const pendingAmount = useMemo(
    () => getPendingAmount(filteredBookings),
    [filteredBookings]
  );

  const paymentStatuses = useMemo(
    () =>
      Array.from(
        new Set(
          bookings
            .map((b) => b.paymentStatus)
            .filter(Boolean)
        )
      ),
    [bookings]
  );

  const bookingStatuses = useMemo(
    () =>
      Array.from(
        new Set(
          bookings
            .map((b) => b.bookingStatus)
            .filter(Boolean)
        )
      ),
    [bookings]
  );

  if (loading && !bookings.length) {
    return (
      <div className="flex min-h-60 items-center justify-center rounded-3xl bg-slate-50 p-10 text-slate-700">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Admin Bookings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer bookings, payments, and cancellations from your
            admin dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>
<div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-12">
  <div className="grid gap-4 sm:col-span-10">
    <div className="grid gap-3 sm:grid-cols-6">
      <label className="flex flex-col gap-2 text-sm text-slate-700">
        Payment Status
        <select
          value={filters.paymentStatus}
          onChange={(e) =>
            handleFilterChange("paymentStatus", e.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        >
          <option value="">All</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-700">
        Booking Status
        <select
          value={filters.bookingStatus}
          onChange={(e) =>
            handleFilterChange("bookingStatus", e.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        >
          <option value="">All</option>
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-700">
        Event Search
        <input
          type="text"
          value={filters.eventSearch}
          onChange={(e) =>
            handleFilterChange("eventSearch", e.target.value)
          }
          placeholder="Search events..."
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-700">
        Start Date
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            handleFilterChange("startDate", e.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-700">
        End Date
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            handleFilterChange("endDate", e.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <button
        type="button"
        onClick={clearFilters}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Clear filters
      </button>
    </div>
  </div>
</div>

<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  <div className="rounded-3xl bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-900 shadow-sm">
    <p className="text-emerald-600">Total Revenue</p>
    <p className="mt-1 text-lg text-emerald-900">
      ₹{totalRevenue.toLocaleString()}
    </p>
  </div>

  <div className="rounded-3xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm">
    <p className="text-slate-600">Pending Payments</p>
    <p className="mt-1 text-lg text-slate-900">
      ₹{pendingAmount.toLocaleString()}
    </p>
  </div>

  <div className="rounded-3xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-900 shadow-sm">
    <p className="text-slate-600">Total Bookings</p>
    <p className="mt-1 text-lg text-slate-900">
      {filteredBookings.length}
    </p>
  </div>
</div>

{error ? (
  <div className="rounded-3xl bg-rose-50 p-6 text-rose-700 ring-1 ring-rose-200">
    <p className="font-semibold">Error</p>
    <p>{error}</p>

    <button
      onClick={loadData}
      className="mt-4 inline-flex items-center rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
    >
      Retry
    </button>
  </div>
) : null}

<div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
  <table className="min-w-full divide-y divide-slate-200">
    <thead className="bg-slate-50 text-left text-sm uppercase tracking-wide text-slate-600">
      <tr>
        <th className="px-4 py-4">User & Event</th>
        <th className="px-4 py-4">Seats & Amount</th>
        <th className="px-4 py-4">Payment Status</th>
        <th className="px-4 py-4">Booking Status</th>
        <th className="px-4 py-4">Created</th>
        <th className="px-4 py-4 text-right">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-slate-200 bg-white text-sm">
      {filteredBookings.map((booking) => (
        <tr key={booking.id} className="hover:bg-slate-50">
          <td className="px-4 py-4">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">
                {getUserDisplayName(booking, users)}
              </p>

              <p className="text-sm text-slate-500">
                {booking.eventTitle}
              </p>
            </div>
          </td>

          <td className="px-4 py-4">
            <div className="space-y-1">
              <p className="font-mono text-sm">
                {booking.seats.join(", ")}
              </p>

              <p className="font-semibold text-emerald-600">
                ₹{booking.amount.toLocaleString()}
              </p>
            </div>
          </td>

          <td className="px-4 py-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                booking.paymentStatus === "paid"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {booking.paymentStatus}
            </span>
          </td>

          <td className="px-4 py-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                booking.bookingStatus === "confirmed"
                  ? "bg-emerald-100 text-emerald-700"
                  : booking.bookingStatus === "reserved"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {booking.bookingStatus}
            </span>
          </td>

          <td className="px-4 py-4 text-sm text-slate-500">
            {new Date(booking.createdAt).toLocaleDateString()}
          </td>

          <td className="px-4 py-4 text-right">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openDetailsModal(booking)}
                className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                View
              </button>

              {booking.bookingStatus !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => openCancelModal(booking)}
                  className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}

      {!filteredBookings.length ? (
        <tr>
          <td
            colSpan="6"
            className="px-4 py-8 text-center text-sm text-slate-500"
          >
            No bookings match the selected filters.
          </td>
        </tr>
      ) : null}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default AdminBookings;