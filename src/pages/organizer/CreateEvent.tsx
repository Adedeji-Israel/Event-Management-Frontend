import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";

interface TicketForm {
  name: string;
  price: string;
  quantity: string;
}

const CreateEvent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    status: "draft",
  });

  const [image, setImage] = useState<File | null>(null);

  const [ticketTypes, setTicketTypes] = useState<TicketForm[]>([
    { name: "", price: "", quantity: "" },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTicketChange = (
    index: number,
    field: keyof TicketForm,
    value: string
  ) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: "", price: "", quantity: "" },
    ]);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    formData.append("ticketTypes", JSON.stringify(ticketTypes));

    if (image) formData.append("image", image);

    await api.post("/events", formData);

    navigate("/dashboard/organizer/events");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-xl border">
      <h1 className="text-xl font-bold mb-4">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" onChange={handleChange} placeholder="Title" className="input" />
        <textarea name="description" onChange={handleChange} placeholder="Description" className="input h-28" />
        <input type="date" name="date" onChange={handleChange} className="input" />
        <input type="time" name="time" onChange={handleChange} className="input" />
        <input name="location" onChange={handleChange} placeholder="Location" className="input" />

        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files ? e.target.files[0] : null)
          }
        />

        <h3 className="font-semibold pt-4">Ticket Types</h3>

        {ticketTypes.map((ticket, index) => (
          <div key={index} className="space-y-2 border p-3 rounded">
            <div>{ticket.name}</div>
            <input
              placeholder="Name"
              onChange={(e) =>
                handleTicketChange(index, "name", e.target.value)
              }
              className="input"
            />
            <input
              placeholder="Price"
              type="number"
              onChange={(e) =>
                handleTicketChange(index, "price", e.target.value)
              }
              className="input"
            />
            <input
              placeholder="Quantity"
              type="number"
              onChange={(e) =>
                handleTicketChange(index, "quantity", e.target.value)
              }
              className="input"
            />
          </div>
        ))}

        <button type="button" onClick={addTicketType} className="text-purple-600">
          + Add Ticket Type
        </button>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;