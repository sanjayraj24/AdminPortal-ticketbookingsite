import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { EVENT_PATH } from "../../services/eventService";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { post } = useApi("http://localhost:3000");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    venue: "",
    city: "",
    dateTime: "",
    price: "",
    status: "published",
    seatMap: "[]",
    totalSeats: "",
    availableSeats: "",
    description: "",
    posterUrl: "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (Number(formData.availableSeats) > Number(formData.totalSeats)) {
        throw new Error("Available seats cannot exceed total seats.");
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        venue: formData.venue,
        city: formData.city,
        dateTime: formData.dateTime
          ? new Date(formData.dateTime).toISOString()
          : "",
        price: Number(formData.price) || 0,
        status: formData.status,
        totalSeats: Number(formData.totalSeats) || 0,
        availableSeats: Number(formData.availableSeats) || 0,
        description: formData.description,
        posterUrl: formData.posterUrl,
        seatMap: formData.seatMap
          ? (() => {
              try {
                return JSON.parse(formData.seatMap);
              } catch {
                throw new Error("Invalid seatMap JSON format.");
              }
            })()
          : [],
      };

      await post(EVENT_PATH, payload);

      navigate("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            Add New Event
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Create a new event and publish it to the admin event list.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Title
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Category
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Venue
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => handleChange("venue", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700">
              City
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Date & time
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleChange("dateTime", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Status
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Price
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Total seats
              <input
                type="number"
                min="0"
                value={formData.totalSeats}
                onChange={(e) => handleChange("totalSeats", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Available seats
              <input
                type="number"
                min="0"
                value={formData.availableSeats}
                onChange={(e) => handleChange("availableSeats", e.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Description
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Poster URL
            <input
              type="text"
              value={formData.posterUrl}
              onChange={(e) => handleChange("posterUrl", e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Seat Map (JSON array)
            <textarea
              value={formData.seatMap}
              onChange={(e) => handleChange("seatMap", e.target.value)}
              rows={10}
              placeholder='[{"id":"A1","row":"A","number":1,"type":"VIP","price":1299,"status":"available"}]'
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 font-mono text-xs"
            />
            <p className="mt-1 text-xs text-slate-500">
              Paste JSON array of seats (used for booking/seat selection)
            </p>
          </label>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-3xl px-5 py-3 text-sm font-semibold btn-primary disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? "Creating..." : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
