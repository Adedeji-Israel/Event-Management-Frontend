import { useState } from "react";
import api from "@/lib/AxiosInterceptor";
import type { Event, TicketType } from "@/types/event";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Props {
    event?: Event | null;
    onSuccess: (event: Event) => void;
    onClose?: () => void;
}

/* ================= VALIDATION ================= */
const validationSchema = Yup.object({
    title: Yup.string().required("Title is required").min(3, "Minimum 3 characters"),
    description: Yup.string().required("Description is required").min(10),
    date: Yup.string().required("Event date required"),
    time: Yup.string().required("Event time required"),
    location: Yup.string().required("Location required"),
    status: Yup.string().required("Status required"),
});

const EventForm = ({ event, onSuccess, onClose }: Props) => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);

    /* ================= TICKETS ================= */
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>(() =>
        event?.ticketTypes ?? [
            { name: "Regular", price: 0, quantity: 0, sold: 0 },
            { name: "VIP", price: 0, quantity: 0, sold: 0 },
        ]
    );

    /* ================= FORM ================= */
    const formik = useFormik({
        initialValues: {
            title: event?.title || "",
            description: event?.description || "",
            date: event?.date?.slice(0, 10) || "",
            time: event?.time || "",
            location: event?.location || "",
            status: event?.status || "draft",
        },
        validationSchema,
        validateOnMount: true,

        onSubmit: async (values) => {
            try {
                setLoading(true);

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

                onSuccess(res.data.event);
                if (onClose) onClose();
            } catch (err: any) {
                alert(err.response?.data?.message || "Failed to save event");
            } finally {
                setLoading(false);
            }
        },
    });

    /* ================= TICKET UPDATE ================= */
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

    /* ================= TICKET VALIDATION ================= */
    const ticketsValid = ticketTypes.every(
        (t) => t.price > 0 && t.quantity > 0
    );

    const formValid = formik.isValid && ticketsValid;

    /* ================= TOTALS ================= */
    const totalRevenue = ticketTypes.reduce(
        (sum, t) => sum + t.price * t.quantity,
        0
    );

    const totalTickets = ticketTypes.reduce(
        (sum, t) => sum + t.quantity,
        0
    );

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
                <label className="text-sm font-medium">Title</label>
                <input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border rounded-lg px-3 py-2"
                />

                {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-sm">{formik.errors.title}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border rounded-lg px-3 py-2"
                />

                {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-sm">
                        {formik.errors.description}
                    </p>
                )}
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border rounded-lg px-3 py-2"
                    />

                    {formik.touched.date && formik.errors.date && (
                        <p className="text-red-500 text-sm">{formik.errors.date}</p>
                    )}
                </div>

                <div>
                    <label>Time</label>
                    <input
                        type="time"
                        name="time"
                        value={formik.values.time}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border rounded-lg px-3 py-2"
                    />

                    {formik.touched.time && formik.errors.time && (
                        <p className="text-red-500 text-sm">{formik.errors.time}</p>
                    )}
                </div>

            </div>

            {/* Location */}

            <div>
                <label>Location</label>
                <input
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border rounded-lg px-3 py-2"
                />

                {formik.touched.location && formik.errors.location && (
                    <p className="text-red-500 text-sm">{formik.errors.location}</p>
                )}
            </div>

            {/* Status */}
            <div>
                <label>Status</label>
                <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                >
                    <option value="draft">Draft</option>
                    <option value="live">Live</option>
                </select>
            </div>

            {/* Image Upload */}
            <div>
                <label>Event Image - {" "}</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                {image && (
                    <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="mt-2 h-32 rounded-lg object-cover"
                    />
                )}
            </div>

            {/* Ticket Types */}
            <div>
                <h3 className="font-semibold mb-4 text-lg">Ticket Types</h3>
                <div className="grid grid-cols-4 gap-3 mb-2 text-sm font-semibold text-gray-600">
                    <span>Ticket Type</span>
                    <span>Price (₦)</span>
                    <span>Quantity</span>
                    <span>Potential Revenue</span>
                </div>

                {ticketTypes.map((ticket, i) => {

                    const revenue = ticket.price * ticket.quantity;

                    return (
                        <div
                            key={i}
                            className="grid grid-cols-4 gap-3 mb-3 items-center"
                        >

                            <input
                                value={ticket.name}
                                disabled
                                className="border rounded-lg px-3 py-2 bg-gray-100"
                            />

                            <input
                                type="number"
                                min={0}
                                value={ticket.price}
                                onChange={(e) =>
                                    updateTicket(i, "price", Number(e.target.value))
                                }
                                className="border rounded-lg px-3 py-2"
                            />

                            <input
                                type="number"
                                min={0}
                                value={ticket.quantity}
                                onChange={(e) =>
                                    updateTicket(i, "quantity", Number(e.target.value))
                                }
                                className="border rounded-lg px-3 py-2"
                            />

                            <div className="text-sm font-medium text-green-600">
                                ₦{revenue.toLocaleString()}
                            </div>

                        </div>
                    );
                })}

                {!ticketsValid && (
                    <p className="text-red-500 text-sm">
                        All ticket prices and quantities must be greater than 0
                    </p>
                )}
            </div>

            {/* Revenue Summary */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-600">Total Tickets</p>
                    <p className="text-lg font-semibold">{totalTickets}</p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-600">Potential Revenue</p>
                    <p className="text-xl font-bold text-purple-700">
                        ₦{totalRevenue.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Submit */}
            <div>
                <button
                    type="submit"
                    disabled={!formValid || loading}
                    className={`w-full py-2 rounded-lg text-white transition ${formValid
                            ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                            : "bg-purple-400 cursor-not-allowed"
                        }`}
                >
                    {loading
                        ? "Saving..."
                        : event
                            ? "Update Event"
                            : "Create Event"}
                </button>
            </div>
        </form>
    );
};

export default EventForm;