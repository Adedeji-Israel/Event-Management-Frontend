// components/OrganizerStatusBadge.tsx
import type { OrganizerRequestStatus } from "@/lib/api/organizer";

const styles: Record<OrganizerRequestStatus, string> = {
    none: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

const labels: Record<OrganizerRequestStatus, string> = {
    none: "Not Requested",
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
};

const OrganizerStatusBadge = ({ status }: { status: OrganizerRequestStatus }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
    </span>
);

export default OrganizerStatusBadge;
