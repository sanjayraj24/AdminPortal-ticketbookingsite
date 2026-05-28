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

      {/* KEEP YOUR OLD TABLE / FILTER / MODAL JSX BELOW THIS */}
    </div>
  );
};

export default AdminBookings;