import { useState, useEffect, useMemo } from "react";
import api from "@/lib/AxiosInterceptor";
import type { Event, TicketType } from "@/types/event";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toastSuccess, toastError } from "@/utils/toast";

interface Props {
  event?: Event | null;
  onSuccess: (event: Event) => void;
  onClose?: () => void;
}

/* ================= VALIDATION ================= */
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").min(3),
  description: Yup.string().required("Description is required").min(10),
  date: Yup.string().required("Event date required"),
  time: Yup.string().required("Event time required"),
  location: Yup.string().required("Location required"),
  status: Yup.string().required("Status required"),
});

const EventForm = ({ event, onSuccess, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ================= INITIAL VALUES ================= */
  const initialValues = useMemo(
    () => ({
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date?.slice(0, 10) || "",
      time: event?.time || "",
      location: event?.location || "",
      status: event?.status || "draft",
    }),
    [event]
  );

  /* ================= TICKETS ================= */
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  useEffect(() => {
    if (event?.ticketTypes) {
      setTicketTypes(event.ticketTypes);
    } else {
      setTicketTypes([
        { name: "Regular", price: 0, quantity: 0, sold: 0 },
        { name: "VIP", price: 0, quantity: 0, sold: 0 },
      ]);
    }
  }, [event]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ================= FORM ================= */
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnMount: true,

    onSubmit: async (values) => {
      if (loading) return;

      setLoading(true);

      try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        formData.append("ticketTypes", JSON.stringify(ticketTypes));

        if (image) {
          formData.append("image", image);
        }

        let res;

        if (event?._id) {
          res = await api.put(`/events/${event._id}/edit`, formData);
        } else {
          res = await api.post("/events/create", formData);
        }

        const savedEvent = res.data.event;

        // ✅ MERGE OLD + NEW (fix stats disappearing)
        const mergedEvent = event ? { ...event, ...savedEvent } : savedEvent;

        toastSuccess(res.data.message || "Event saved successfully");

        onSuccess(mergedEvent);

        if (onClose) onClose();

      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save event";

        toastError(message);
      } finally {
        setLoading(false);
      }
    },
  });

  /* ================= CHANGE DETECTION ================= */
  const hasFormChanged =
    JSON.stringify(formik.values) !== JSON.stringify(initialValues);

  const hasTicketsChanged =
    JSON.stringify(ticketTypes) !== JSON.stringify(event?.ticketTypes || []);

  const hasImageChanged = !!image;

  const hasChanged = hasFormChanged || hasTicketsChanged || hasImageChanged;

  /* ================= HELPERS ================= */
  const updateTicket = (
    index: number,
    field: keyof TicketType,
    value: number
  ) => {
    setTicketTypes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const ticketsValid = ticketTypes.every(
    (t) => t.price > 0 && t.quantity > 0
  );

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`space-y-8 ${loading ? "opacity-70 pointer-events-none" : ""}`}
    >
      {/* ================= BASIC INFO ================= */}
      <div className="bg-gray-50 p-5 rounded-xl border space-y-5">
        <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>

        {/* TITLE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Event Title</label>
          <input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="e.g. Tech Conference 2026"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-xs">{formik.errors.title}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            rows={4}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Describe your event..."
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-xs">{formik.errors.description}</p>
          )}
        </div>
      </div>

      {/* ================= DATE & LOCATION ================= */}
      <div className="bg-gray-50 p-5 rounded-xl border space-y-5">
        <h2 className="text-lg font-semibold text-gray-700">Date & Location</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {formik.errors.date && (
              <p className="text-red-500 text-xs">{formik.errors.date}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {formik.errors.time && (
              <p className="text-red-500 text-xs">{formik.errors.time}</p>
            )}
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Location</label>
          <input
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="e.g. Lagos, Nigeria"
          />
          {formik.errors.location && (
            <p className="text-red-500 text-xs">{formik.errors.location}</p>
          )}
        </div>
      </div>

      {/* ================= STATUS & IMAGE ================= */}
      <div className="bg-gray-50 p-5 rounded-xl border space-y-5">
        <h2 className="text-lg font-semibold text-gray-700">Settings</h2>

        {/* STATUS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Event Status</label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="draft">Draft</option>
            <option value="live">Live</option>
          </select>
        </div>

        {/* IMAGE */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Event Banner</label>

          <input
            type="file"
            className="border rounded-lg p-2 bg-white"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);

              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= TICKETS ================= */}
      <div className="bg-gray-50 p-5 rounded-xl border space-y-5">
        <h2 className="text-lg font-semibold text-gray-700">Ticket Pricing</h2>

        {/* HEADERS */}
        <div className="grid grid-cols-3 gap-3 text-sm font-medium text-gray-600">
          <span>Type</span>
          <span>Price (₦)</span>
          <span>Quantity</span>
        </div>

        {ticketTypes.map((ticket, i) => (
          <div
            key={i}
            className="grid grid-cols-3 gap-3 items-center bg-white p-3 rounded-lg border"
          >
            {/* TYPE */}
            <input
              value={ticket.name}
              disabled
              className="bg-gray-100 px-2 py-2 rounded"
            />

            {/* PRICE */}
            <input
              type="number"
              placeholder="0"
              value={ticket.price}
              onChange={(e) =>
                updateTicket(i, "price", Number(e.target.value))
              }
              className="border px-2 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
            />

            {/* QUANTITY */}
            <input
              type="number"
              placeholder="0"
              value={ticket.quantity}
              onChange={(e) =>
                updateTicket(i, "quantity", Number(e.target.value))
              }
              className="border px-2 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        ))}
      </div>

      {/* ================= SUBMIT ================= */}
      <button
        type="submit"
        disabled={
          loading ||
          !formik.isValid ||
          !ticketsValid ||
          (event ? !hasChanged : false)
        }
        className={`w-full py-3 rounded-xl text-white font-medium transition ${loading || !formik.isValid || !ticketsValid || (event && !hasChanged)
          ? "bg-purple-400 cursor-not-allowed"
          : "bg-purple-600 cursor-pointer hover:bg-purple-700"
          }`}
      >
        {loading
          ? event
            ? "Updating..."
            : "Creating..."
          : event
            ? "Update Event"
            : "Create Event"}
      </button>
    </form>
  );
};

export default EventForm;