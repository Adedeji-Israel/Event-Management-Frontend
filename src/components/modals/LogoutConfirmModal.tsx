import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

interface Props {
    show: boolean;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function LogoutConfirmModal({
    show,
    loading,
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
            <Modal.Header closeButton={!loading}>
                <Modal.Title>Confirm Logout</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-gray-600">
                Are you sure you want to sign out? You’ll need to log in again to access your dashboard.
            </Modal.Body>

            <Modal.Footer className="w-full d-flex">
                {/* Cancel */}
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <div className="flex-grow-1" />

                {/* Confirm */}
                <Button
                    variant="danger"
                    size="sm"
                    onClick={onConfirm}
                    disabled={loading}
                    className="d-flex align-items-center gap-2 px-4"
                >
                    {loading ? (
                        <>
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Signing out…
                        </>
                    ) : (
                        "Sign Out"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LogoutConfirmModal;
