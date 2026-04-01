import type { Event } from "@/types/event";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Copyright from "@/components/Copyright";

interface SelectedTicket {
    ticketTypeId: string;
    quantity: number;
}

interface Attendee {
    ticketTypeId: string;
    ticketName: string;
    index: number;
    name: string;
}

const CheckoutPageTwo = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState<Event | null>(null);
    const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
    const [billing, setBilling] = useState({
        fullName: "",
        userName: "",
        email: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    // const [loading, setLoading] = useState(false);

    // ================= LOAD DATA =================
    useEffect(() => {
        const saved = sessionStorage.getItem("selectedTickets");

        if (!saved) {
            navigate(-1);
            return;
        }

        setSelectedTickets(JSON.parse(saved));

        const fetchEvent = async () => {
            const res = await api.get(`/events/${eventId}`);
            setEvent(res.data.event);
        };

        fetchEvent();
    }, []);

    // ================= AUTO FILL USER =================
    useEffect(() => {
        if (user) {
            setBilling({
                fullName: user.fullName || "",
                userName: user.userName || "",
                email: user.email || "",
            });
        }
    }, [user]);

    // ================= GENERATE ATTENDEE FIELDS =================
    useEffect(() => {
        if (!event || selectedTickets.length === 0) return;

        const generated: Attendee[] = [];

        selectedTickets.forEach(ticket => {
            const type = event.ticketTypes.find(
                t => t._id === ticket.ticketTypeId
            );

            if (!type) return;
            if (!type._id) return;

            for (let i = 1; i <= ticket.quantity; i++) {
                generated.push({
                    ticketTypeId: type._id,
                    ticketName: type.name,
                    index: i,
                    name: "",
                });
            }
        });

        setAttendees(generated);
    }, [event, selectedTickets]);

    // ================= HANDLE ATTENDEE NAME =================
    const handleAttendeeChange = (i: number, value: string) => {
        const updated = [...attendees];
        updated[i].name = value;
        setAttendees(updated);
    };

    // ================= TOTAL =================
    const totalAmount = selectedTickets.reduce((sum, t) => {
        const type = event?.ticketTypes.find(x => x._id === t.ticketTypeId);
        if (!type) return sum;
        return sum + type.price * t.quantity;
    }, 0);

    // ================= PROCEED =================
    const handleProceed = async () => {
        if (isSubmitting) return;

        const emptyAttendee = attendees.find(a => !a.name);
        if (emptyAttendee) {
            toast.info("Please fill all attendee names");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await api.post(`/tickets/book/${eventId}`, {
                tickets: selectedTickets,
                billing,
                attendees,
            });

            const url = res.data?.authorizationUrl;

            if (!url) {
                throw new Error("No payment link returned");
            }

            // 🚀 Redirect immediately (NO TIMEOUT)
            window.location.href = url;

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Booking failed");
            setIsSubmitting(false);
        }
    };

    if (!event) return <div className="p-10">Loading...</div>;

    return (
        <div>
            <div className="bg-purple-600">
                <Header />
            </div>
            <div className="min-h-screen bg-gray-100 py-6 px-6">
                {/* PAGE HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">Event Booking</h1>

                    <div className="flex justify-center items-center gap-6 mt-4 text-sm">

                        {/* Step 1 Completed */}
                        <div className="flex items-center gap-2 text-purple-600 font-semibold">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs">
                                ✓
                            </div>
                            Select Tickets
                        </div>

                        <div className="h-px w-12 bg-gray-300" />

                        {/* Step 2 Active */}
                        <div className="flex items-center gap-2 font-semibold">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs">
                                2
                            </div>
                            Billing & Payment
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">

                    {/* ================= LEFT ================= */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Billing Info */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">

                            <h2 className="text-xl font-semibold mb-6">
                                Billing Information
                            </h2>

                            {/* Fieldset disables entire form */}
                            <fieldset disabled className="space-y-6 opacity-70">

                                <div className="grid md:grid-cols-2 gap-6">

                                    {/* Full Name */}
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="fullName"
                                            className="text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            value={billing.fullName}
                                            className="border border-gray-300 p-3 rounded-xl bg-gray-100 cursor-not-allowed"
                                            readOnly
                                        />
                                    </div>

                                    {/* Username */}
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="userName"
                                            className="text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Username
                                        </label>
                                        <input
                                            id="userName"
                                            type="text"
                                            value={billing.userName}
                                            className="border border-gray-300 p-3 rounded-xl bg-gray-100 cursor-not-allowed"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={billing.email}
                                        className="border border-gray-300 p-3 rounded-xl bg-gray-100 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>

                            </fieldset>
                        </div>

                        {/* ================= ATTENDEE SECTION ================= */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">
                                Attendee Details
                            </h2>

                            {attendees.map((attendee, index) => (
                                <div
                                    key={index}
                                    className="mb-6 border p-5 rounded-xl bg-gray-50"
                                >
                                    <h4 className="font-medium mb-3">
                                        Attendee {attendee.index} ({attendee.ticketName})
                                    </h4>

                                    <input
                                        placeholder="Attendee Full Name"
                                        className="w-full border p-3 rounded-lg"
                                        value={attendee.name}
                                        onChange={(e) =>
                                            handleAttendeeChange(index, e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= RIGHT SUMMARY ================= */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm h-fit sticky top-10">

                        <h2 className="text-purple-600 text-xl font-semibold mb-4">
                            {event.title}
                        </h2>

                        <div className="text-sm text-gray-600 space-y-4 mb-6">

                            {/* Date */}
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span>
                                    {new Date(event.date).toLocaleDateString("en-GB", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}.
                                </span>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span>{event.time}</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                <span>{event.location}</span>
                            </div>

                        </div>

                        <hr className="my-4" />

                        <h3 className="font-semibold mb-4">Booking Summary</h3>

                        {selectedTickets.map(t => {
                            const type = event.ticketTypes.find(
                                x => x._id === t.ticketTypeId
                            );

                            if (!type) return null;

                            return (
                                <div
                                    key={t.ticketTypeId}
                                    className="flex justify-between mb-2"
                                >
                                    <span>{type.name} × {t.quantity}</span>
                                    <span>
                                        ₦{(type.price * t.quantity).toLocaleString()}
                                    </span>
                                </div>
                            );
                        })}

                        <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₦{totalAmount.toLocaleString()}</span>
                        </div>

                        <button
                            onClick={handleProceed}
                            disabled={isSubmitting}
                            className={`w-full mt-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 ${isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95"
                                }`}
                        >
                            {isSubmitting ? "Redirecting to Paystack..." : "Proceed to Payment"}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
            <Copyright />
        </div>

    );
};

export default CheckoutPageTwo;