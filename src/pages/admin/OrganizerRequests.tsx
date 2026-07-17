// pages/admin/OrganizerRequests.tsx
import { useEffect, useState } from "react";
import { Check, X, Loader2, Inbox } from "lucide-react";
import {
    fetchOrganizerRequests,
    approveOrganizerRequest,
    rejectOrganizerRequest,
    type OrganizerRequestUser,
} from "@/lib/api/organizer";
import { toastSuccess, toastError } from "@/utils/toast";
import OrganizerStatusBadge from "@/components/OrganizerStatusBadge";


// const avatarColors = [
//     "bg-purple-100 text-purple-700",
//     "bg-blue-100 text-blue-700",
//     "bg-amber-100 text-amber-700",
//     "bg-pink-100 text-pink-700",
//     "bg-teal-100 text-teal-700",
// ];

const OrganizerRequests = () => {
    const [requests, setRequests] = useState<OrganizerRequestUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await fetchOrganizerRequests();
            setRequests(data);
        } catch {
            toastError("Failed to load organizer requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleDecision = async (
        user: OrganizerRequestUser,
        decision: "approve" | "reject"
    ) => {
        setActioningId(user._id);
        try {
            const action =
                decision === "approve" ? approveOrganizerRequest : rejectOrganizerRequest;
            await action(user._id);

            toastSuccess(
                decision === "approve"
                    ? `${user.fullName} approved as organizer`
                    : `${user.fullName}'s request was rejected`
            );

            setRequests(prev =>
                prev.map(r =>
                    r._id === user._id
                        ? { ...r, organizerRequest: decision === "approve" ? "approved" : "rejected" }
                        : r
                )
            );
        } catch (err: any) {
            toastError(
                err?.response?.data?.message ||
                `Failed to ${decision} ${user.fullName}'s request. Please try again.`
            );
        } finally {
            setActioningId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-gray-400">
                <Loader2 className="animate-spin" size={24} />
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Inbox size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">No organizer requests yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        New requests will show up here for review.
                    </p>
                </div>
            ) : (
                <>
                    {/* MOBILE / TABLET — stacked cards, below md */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {requests.map(r => (
                            <div key={r._id} className="p-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            <span className="text-gray-600">Name: </span>
                                            {r.fullName}
                                        </p>
                                    </div>
                                    <div>
                                        <OrganizerStatusBadge status={r.organizerRequest} />
                                    </div>
                                </div>

                                <p className="font-medium text-md text-gray-900 truncate">
                                    <span className="text-gray-600">Email: </span>
                                    {r.email}
                                </p>
                                <p className="font-medium text-md text-gray-600 mb-3">
                                    DOB:{" "}
                                    <span className="text-gray-900">
                                        {new Date(r.dateOfBirth).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </p>

                                {r.organizerRequest === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDecision(r, "approve")}
                                            disabled={actioningId === r._id}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold cursor-pointer hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {actioningId === r._id ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Check size={14} />
                                            )}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleDecision(r, "reject")}
                                            disabled={actioningId === r._id}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-semibold cursor-pointer hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {actioningId === r._id ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <X size={14} />
                                            )}
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP — full table, md and up */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-3.5 text-left font-medium text-gray-500 text-lg uppercase tracking-wide">
                                        Name
                                    </th>
                                    <th className="px-6 py-3.5 text-left font-medium text-gray-500 text-lg uppercase tracking-wide hidden lg:table-cell">
                                        Email
                                    </th>
                                    <th className="px-6 py-3.5 text-left font-medium text-gray-500 text-lg uppercase tracking-wide hidden lg:table-cell">
                                        Date of Birth
                                    </th>
                                    <th className="px-6 py-3.5 text-left font-medium text-gray-500 text-lg uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="px-6 py-3.5 text-right font-medium text-gray-500 text-lg uppercase tracking-wide">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map(r => (
                                    <tr key={r._id} className="hover:bg-gray-50/60 transition-colors text-md">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="min-w-0">
                                                    <span className="font-medium text-gray-900 block truncate">
                                                        {r.fullName}
                                                    </span>
                                                    {/* Email shows here on md screens where the dedicated column is hidden */}
                                                    <span className="text-gray-400 text-xs block truncate lg:hidden">
                                                        {r.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-md hidden lg:table-cell">
                                            {r.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-md hidden lg:table-cell">
                                            {new Date(r.dateOfBirth).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrganizerStatusBadge status={r.organizerRequest} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {r.organizerRequest === "pending" ? (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDecision(r, "approve")}
                                                        disabled={actioningId === r._id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-md font-semibold cursor-pointer hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {actioningId === r._id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Check size={14} />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecision(r, "reject")}
                                                        disabled={actioningId === r._id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-md font-semibold cursor-pointer hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {actioningId === r._id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <X size={14} />
                                                        )}
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-md block text-right">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrganizerRequests;
