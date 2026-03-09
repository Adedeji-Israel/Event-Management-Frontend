import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import { Plus, Trash2, ImageIcon } from "lucide-react";

interface TicketForm {
  name: string;
  price: number;
  quantity: number;
}

const CreateEvent = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "draft",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [ticketTypes, setTicketTypes] = useState<TicketForm[]>([
    { name: "Regular", price: 0, quantity: 0 },
  ]);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE ================= */

  const handleImage = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= TICKET ================= */

  const handleTicketChange = (
    index: number,
    field: keyof TicketForm,
    value: string
  ) => {
    const updated = [...ticketTypes];

    updated[index] = {
      ...updated[index],
      [field]: field === "name" ? value : Number(value),
    };

    setTicketTypes(updated);
  };

  const addTicketType = (name = "") => {
    setTicketTypes([
      ...ticketTypes,
      { name, price: 0, quantity: 0 },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  /* ================= REVENUE CALCULATOR ================= */

  const totalRevenue = ticketTypes.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  const totalTickets = ticketTypes.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0
  );

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      const formattedTickets = ticketTypes.map((ticket) => ({
        ...ticket,
        sold: 0,
      }));

      formData.append("ticketTypes", JSON.stringify(formattedTickets));

      if (image) formData.append("image", image);

      await api.post("/events", formData);

      navigate("/dashboard/organizer/events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border rounded-xl p-8 space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-purple-600">
          Create New Event
        </h1>
        <p className="text-gray-500 text-sm">
          Setup your event and start selling tickets
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* EVENT DETAILS */}

        <div className="space-y-4">

          <h2 className="font-semibold text-lg">Event Details</h2>

          <input
            name="title"
            placeholder="Event Title"
            onChange={handleChange}
            className="input"
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            onChange={handleChange}
            className="input h-28"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input type="date" name="date" onChange={handleChange} className="input" required />
            <input type="time" name="time" onChange={handleChange} className="input" required />
          </div>

          <input
            name="location"
            placeholder="Event Location"
            onChange={handleChange}
            className="input"
            required
          />

        </div>

        {/* IMAGE */}

        <div className="space-y-3">

          <h2 className="font-semibold text-lg">Event Banner</h2>

          <label className="block border rounded-xl overflow-hidden cursor-pointer">

            {preview ? (
              <img
                src={preview}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={30} />
                Upload Event Image
              </div>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImage(e.target.files[0])
              }
            />

          </label>

        </div>

        {/* TICKETS */}

        <div className="space-y-4">

          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Ticket Types</h2>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => addTicketType("VIP")}
                className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded"
              >
                + VIP
              </button>

              <button
                type="button"
                onClick={() => addTicketType("Regular")}
                className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded"
              >
                + Regular
              </button>

              <button
                type="button"
                onClick={() => addTicketType("")}
                className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded flex items-center gap-1"
              >
                <Plus size={14} /> Custom
              </button>

            </div>
          </div>

          {ticketTypes.map((ticket, index) => (

            <div
              key={index}
              className="grid md:grid-cols-3 gap-3 border rounded-lg p-4 relative"
            >

              <input
                placeholder="Ticket Name"
                value={ticket.name}
                onChange={(e) =>
                  handleTicketChange(index, "name", e.target.value)
                }
                className="input"
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={ticket.price}
                onChange={(e) =>
                  handleTicketChange(index, "price", e.target.value)
                }
                className="input"
                required
              />

              <input
                type="number"
                placeholder="Quantity"
                value={ticket.quantity}
                onChange={(e) =>
                  handleTicketChange(index, "quantity", e.target.value)
                }
                className="input"
                required
              />

              {ticketTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}

            </div>

          ))}

        </div>

        {/* SUMMARY */}

        <div className="bg-gray-50 border rounded-lg p-4 space-y-2">

          <h3 className="font-semibold">Ticket Summary</h3>

          <div className="flex justify-between text-sm">
            <span>Total Tickets</span>
            <span>{totalTickets}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Potential Revenue</span>
            <span className="font-semibold">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </div>

        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Creating Event..." : "Create Event"}
        </button>

      </form>
    </div>
  );
};

export default CreateEvent;