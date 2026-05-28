export const BOOKING_PATH = "/bookings";

export const filterBookings = (bookings, filters) => {
  const { paymentStatus, bookingStatus, eventSearch, startDate, endDate } =
    filters;

  return bookings.filter((booking) => {
    const matchesPayment = paymentStatus
      ? booking.paymentStatus === paymentStatus
      : true;
    const matchesBooking = bookingStatus
      ? booking.bookingStatus === bookingStatus
      : true;
    const matchesSearch = eventSearch
      ? booking.eventTitle.toLowerCase().includes(eventSearch.toLowerCase())
      : true;
    const createdDate = new Date(booking.createdAt);
    const matchesStart = startDate ? createdDate >= new Date(startDate) : true;
    const matchesEnd = endDate ? createdDate <= new Date(endDate) : true;
    return (
      matchesPayment &&
      matchesBooking &&
      matchesSearch &&
      matchesStart &&
      matchesEnd
    );
  });
};

export const getTotalRevenue = (bookings) => {
  return bookings.reduce((sum, booking) => sum + booking.amount, 0);
};

export const getPendingAmount = (bookings) => {
  return bookings
    .filter((b) => b.paymentStatus === "pending")
    .reduce((sum, booking) => sum + booking.amount, 0);
};

export const getUserDisplayName = (booking, users = []) => {
  const user = users.find((u) => u.id === booking.userId);
  return user ? user.name || user.email || "Unknown User" : "Unknown User";
};
