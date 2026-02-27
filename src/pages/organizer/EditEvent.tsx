import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";

const EditEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<any>(null);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        api.get(`/events/${eventId}`).then(res =>
            setForm(res.data.event)
        );
    }, [eventId]);

    const handleChange = (e: any) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) =>
            formData.append(key, value as any)
        );

        if (image) formData.append("image", image);

        await api.put(`/events/${eventId}`, formData);

        navigate("/dashboard/organizer/events");
    };

    if (!form) return <p>Loading...</p>;

    return (
        <div className="max-w-xl bg-white p-6 rounded-xl border">
            <h1 className="text-xl font-bold mb-4">Edit Event</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} className="input" />
                <textarea name="description" value={form.description} onChange={handleChange} className="input h-28" />
                <input type="date" name="date" value={form.date?.slice(0, 10)} onChange={handleChange} className="input" />
                <input type="time" name="time" value={form.time} onChange={handleChange} className="input" />
                <input name="location" value={form.location} onChange={handleChange} className="input" />

                <input type="file" onChange={(e: any) => setImage(e.target.files[0])} />

                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
