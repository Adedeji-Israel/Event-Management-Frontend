import { useState } from "react";
import api from "@/lib/AxiosInterceptor";
import type { TicketType } from "@/types/event";

interface Props {
  event: {
    _id: string;
    title: string;
    ticketTypes: TicketType[];
  };
  onClose: () => void;
}

const BookingModal = ({ event, onClose }: Props) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedTicket = event.ticketTypes[selectedTypeIndex];

  const total = (selectedTicket?.price ?? 0) * quantity;

  const handleBooking = async () => {
    if (!selectedTicket) return;

    try {
      setLoading(true);

      await api.post(`/tickets/book/${event._id}`, {
        eventId: event._id,
        ticketType: selectedTicket.name,
        quantity,
        totalAmount: total,
      });

      alert("Booking successful!");
      onClose();
      window.location.reload();
    } catch (error) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-2xl space-y-5 shadow-lg">
        <h3 className="text-lg font-bold">Book: {event.title}</h3>

        <div>
          <label className="text-sm font-medium">Ticket Type</label>
          <select
            value={selectedTypeIndex}
            onChange={(e) => setSelectedTypeIndex(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {event.ticketTypes.map((type, index) => (
              <option key={index} value={index}>
                {type.name} — ₦{type.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-lg font-bold text-purple-600">
            ₦{total.toLocaleString()}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;