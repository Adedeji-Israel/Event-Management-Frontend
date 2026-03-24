import Modal from "react-bootstrap/Modal";
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
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      {/* HEADER */}
      <Modal.Header className="flex justify-between items-center border-b py-2">
        <Modal.Title className="text-purple-600 font-bold text-xl">
          Edit Event
        </Modal.Title>

        <button
          onClick={handleClose}
          className="text-gray-500 text-xl font-bold cursor-pointer hover:text-black"
        >
          ✕
        </button>
      </Modal.Header>

      {/* BODY */}
      <Modal.Body
        style={{
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        {eventData && (
          <EventForm
            event={eventData}
            onSuccess={onSuccess}
            onClose={handleClose}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditEventModal;