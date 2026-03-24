import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface Props {
    show: boolean;
    loading?: boolean;

    title: string;
    message: string;

    confirmText?: string;
    cancelText?: string;

    confirmVariant?: string;

    onClose: () => void;
    onConfirm: () => void;
}

function ConfirmModal({
    show,
    loading = false,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    onClose,
    onConfirm,
}: Props) {
    return (
        <Modal
            show={show}
            onHide={loading ? undefined : onClose}
            centered
            backdrop="static"
            keyboard={!loading}
            animation
        >
            {/* HEADER */}
            <Modal.Header className="flex justify-between align-center">
                <Modal.Title className="text-2xl ">{title}</Modal.Title>

                {/* Custom Close Button */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="text-gray-500 text-2xl font-bold cursor-pointer hover:text-black border-0 bg-transparent"
                >
                    ✕
                </button>
            </Modal.Header>

            {/* BODY */}
            <Modal.Body className="text-gray-600">{message}</Modal.Body>

            {/* FOOTER */}
            <Modal.Footer className="w-full d-flex">
                {/* Cancel */}
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <div className="flex-grow-1" />

                {/* Confirm */}
                <Button
                    variant={confirmVariant}
                    size="sm"
                    onClick={onConfirm}
                    disabled={loading}
                    className="d-flex align-items-center gap-2 px-4"
                >
                    {loading ? "Processing..." : confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;