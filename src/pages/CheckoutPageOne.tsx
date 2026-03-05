import type { Event, TicketType } from "@/types/event";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/AxiosInterceptor";
import { toast } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Copyright from "@/components/Copyright";

interface SelectedTicket {
  ticketTypeId: string;
  quantity: number;
}

const CheckoutPageOne = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        const eventData: Event = res.data.event;

        setEvent(eventData);

        const initialSelected = eventData.ticketTypes.map((t: TicketType) => ({
          ticketTypeId: t._id!,
          quantity: 0,
        }));

        setSelectedTickets(initialSelected);
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch event");
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  // handle quantity change
  const handleQuantityChange = (ticketTypeId: string, qty: number) => {
    setSelectedTickets((prev) =>
      prev.map((t) =>
        t.ticketTypeId === ticketTypeId
          ? { ...t, quantity: Math.max(0, qty) }
          : t
      )
    );
  };

  // total tickets selected
  const totalQuantity = selectedTickets.reduce((sum, t) => sum + t.quantity, 0);

  // total amount calculation
  const totalAmount = selectedTickets.reduce((sum, t) => {
    const ticketType = event?.ticketTypes.find((x) => x._id === t.ticketTypeId);
    if (!ticketType) return sum; // skip if not found
    return sum + ticketType.price * t.quantity;
  }, 0);

  const handleContinue = () => {
    const ticketsToSave = selectedTickets.filter((t) => t.quantity > 0);

    if (ticketsToSave.length === 0) {
      toast.info("Select at least one ticket");
      return;
    }

    sessionStorage.setItem("selectedTickets", JSON.stringify(ticketsToSave));
    navigate(`/events/${eventId}/billing`);
  };

  if (!event) return <div className="p-10">Loading...</div>;

  return (
    <div>
      <div className="bg-purple-600">
        <Header />
      </div>

      <div className="bg-gray-100 min-h-screen space-y-6 py-6 px-6">
        {/* PAGE HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Event Booking</h1>

          <div className="flex justify-center items-center gap-6 mt-4 text-sm">
            {/* Step 1 Active */}
            <div className="flex items-center gap-2 text-purple-600 font-semibold">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs">
                1
              </div>
              Select Tickets
            </div>

            <div className="h-px w-12 bg-gray-300" />

            {/* Step 2 */}
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 text-xs">
                2
              </div>
              Billing & Payment
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="bg-white p-4 rounded-xl">
              <span className="text-2xl text-purple-600 font-bold">Event Title</span>
              <h2 className="text-2xl font-semibold">{event.title}</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl text-purple-600 font-bold mb-4">
                Event Information
              </h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl text-purple-600 font-bold mb-2">
                Event About
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Join us for an unforgettable experience filled with insights,
                networking, and value-packed sessions designed to inspire
                and empower attendees.
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="space-y-4 text-md text-gray-600">
                <p>
                  <span className="font-semibold text-gray-800">Date:</span>{" "}
                  <span>
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Time:</span>{" "}
                  {event.time}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Venue:</span>{" "}
                  {event.location}
                </p>
              </div>
            </div>

            {/* Tickets Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Tickets</h3>

              {event.ticketTypes.map((type: TicketType) => {
                const selected = selectedTickets.find(
                  (t) => t.ticketTypeId === type._id
                );
                const available = type.quantity - type.sold;
                const subtotal = (selected?.quantity || 0) * type.price;

                return (
                  <div key={type._id} className="border rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-purple-600">{type.name}</h4>
                        <p className="text-sm text-gray-500">{available} seats remaining</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{type.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              type._id!,
                              (selected?.quantity || 0) - 1
                            )
                          }
                          className="px-3 py-1 bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-4">{selected?.quantity || 0}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              type._id!,
                              Math.min(
                                available,
                                (selected?.quantity || 0) + 1
                              )
                            )
                          }
                          className="px-3 py-1 bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-semibold">₦{subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}

              {/* Total Section */}
              <div className="border-t pt-4 mt-6 text-sm">
                <div className="flex justify-between mb-2">
                  <span>Quantity:</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={totalQuantity === 0}
                className={`w-full mt-6 py-3 rounded-xl text-white font-semibold transition ${
                  totalQuantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 cursor-pointer hover:bg-purple-700"
                }`}
              >
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Copyright />
    </div>
  );
};

export default CheckoutPageOne;