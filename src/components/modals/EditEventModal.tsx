import EventForm from "@/components/forms/EventForm";
import type { Event } from "@/types/event";

interface Props {
  show: boolean;
  handleClose: () => void;
  eventData: Event | null;
  onSuccess: (event: Event) => void;
}

const EditEventModal = ({
  show,
  handleClose,
  eventData,
  onSuccess,
}: Props) => {
  if (!show || !eventData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center border-b py-2 mb-6">
          <h2 className="text-2xl text-purple-600 font-bold">Edit Event</h2>

          <button
            onClick={handleClose}
            className="text-gray-500 text-2xl font-bold cursor-pointer hover:text-black"
          >
            ✕
          </button>
        </div>

        <EventForm
          event={eventData}
          onSuccess={onSuccess}
          onClose={handleClose}
        />

      </div>
    </div>
  );
};

export default EditEventModal;