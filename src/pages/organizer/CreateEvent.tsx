import { useNavigate } from "react-router-dom";
import EventForm from "@/components/forms/EventForm";

const CreateEvent = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border">
      <h1 className="text-xl font-bold mb-6 text-purple-600">
        Create Event
      </h1>

      <EventForm
        onSuccess={() => {
          navigate("/dashboard/organizer/events"); 
        }}
      />
    </div>
  );
};

export default CreateEvent;