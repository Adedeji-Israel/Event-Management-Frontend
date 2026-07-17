// pages/attendee/OrganizerRequest.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { requestOrganizerAccess } from "@/lib/api/organizer";
import { toastSuccess, toastError } from "@/utils/toast";
import OrganizerStatusBadge from "@/components/OrganizerStatusBadge";

const POLL_INTERVAL_MS = 15000;

const OrganizerRequest = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [justApproved, setJustApproved] = useState(false);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const status = user?.organizerRequest ?? "none";
    const canRequest = status === "none" || status === "rejected";

    const stopPolling = () => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    };

    // Poll only while a request is actively pending
    useEffect(() => {
        if (status !== "pending") {
            stopPolling();
            return;
        }

        pollRef.current = setInterval(() => {
            refreshUser();
        }, POLL_INTERVAL_MS);

        return stopPolling;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    // React the moment status flips to approved
    useEffect(() => {
        if (status === "approved") {
            stopPolling();
            setJustApproved(true);
            const timer = setTimeout(() => {
                navigate("/dashboard/organizer", { replace: true });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const handleRequest = async () => {
        setLoading(true);
        try {
            const data = await requestOrganizerAccess();
            toastSuccess(data?.message || "Request submitted successfully");
            await refreshUser();
        } catch (err: any) {
            toastError(err?.response?.data?.message || "Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (justApproved) {
        return (
            <div className="max-w-2xl">
                <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-3">
                    <CheckCircle2 className="text-green-600" size={24} />
                    <div>
                        <p className="font-semibold text-gray-900">You're approved!</p>
                        <p className="text-sm text-gray-500">Taking you to your organizer dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Organizer Access</h2>
                    <OrganizerStatusBadge status={status} />
                </div>

                {status === "none" && (
                    <p className="text-sm text-gray-500 mb-6">
                        Want to host your own events on EventPlace? Submit a request and
                        our admin team will review it.
                    </p>
                )}

                {status === "pending" && (
                    <p className="text-sm text-gray-500 mb-6">
                        Your request is currently under review. This page will update
                        automatically once a decision is made.
                    </p>
                )}

                {status === "rejected" && (
                    <p className="text-sm text-gray-500 mb-6">
                        Your previous request was not approved. You're welcome to submit
                        a new one.
                    </p>
                )}

                {canRequest && (
                    <button
                        onClick={handleRequest}
                        disabled={loading}
                        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <UserPlus size={16} />
                        )}
                        {loading ? "Submitting..." : "Request Organizer Access"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrganizerRequest;
