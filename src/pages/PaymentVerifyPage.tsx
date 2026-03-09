import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import BackgroundImage from "@/assets/images/hero_area_image_3.jpg";
import Logo from "@/assets/images/logo.png";

type Status = "verifying" | "success" | "failed";

const PaymentVerifyPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<Status>("verifying");
    const [ticket, setTicket] = useState<any>(null);
    const [downloading, setDownloading] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // ================= VERIFY PAYMENT =================
    useEffect(() => {
        const reference = params.get("reference");
        if (!reference) {
            setStatus("failed");
            return;
        }

        const verify = async () => {
            try {
                // Populate event details from backend
                const res = await api.get(
                    `/tickets/payment/confirm?reference=${reference}&populateEvent=true`
                );

                setTicket(res.data.ticket);
                setStatus("success");
            } catch (error) {
                console.error("Payment verification failed:", error);
                setStatus("failed");
            }
        };

        verify();
    }, [params]);

    // ================= COUNTDOWN REDIRECT =================
    useEffect(() => {
        if (status !== "success") return;
        if (countdown === 0) {
            navigate("/dashboard/attendee/my-tickets");
            return;
        }

        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, status, navigate]);

    // ================= HANDLE PDF DOWNLOAD =================
    const handleDownloadPDF = async () => {
        if (!ticket?._id) return;
        try {
            setDownloading(true);
            const response = await api.get(`/tickets/${ticket._id}/download/pdf`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${ticket.ticketId || "ticket"}.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        } finally {
            setDownloading(false);
        }
    };

    // ================= VERIFYING STATE =================
    if (status === "verifying") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-purple-600" />
                    <p className="mt-4 text-gray-600">Verifying your payment, please wait...</p>
                </div>
            </div>
        );
    }

    // ================= FAILED STATE =================
    if (status === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-10 rounded-2xl shadow max-w-md w-full text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-3">Payment Failed</h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't confirm your payment. Please try again or contact support.
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-gray-200 py-3 rounded-xl mb-3"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-purple-600 text-white py-3 rounded-xl"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // ================= SUCCESS STATE =================
    return (
        <div
            className="w-full min-h-screen py-10 bg-gray-100 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <div className="flex flex-col items-center w-full">
                {/* Logo */}
                <img src={Logo} alt="site_logo" className="w-60 mb-5" />

                {/* Success Card */}
                <div className="w-[80%] max-w-md bg-white backdrop-blur-md p-8 rounded-lg shadow-xl">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-4 text-center">
                        <CheckCircle2 className="w-14 h-14 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-[#4B22A6]">PAYMENT SUCCESSFUL</h2>
                        <p className="text-gray-600 mt-2">Your tickets have been confirmed 🎉</p>
                    </div>

                    {/* Event Details */}
                    {ticket?.event?.title && (
                        <div className="mb-4 border-b pb-4 space-y-2">
                            <h2 className="text-2xl font-semibold text-purple-600">{ticket.event.title}</h2>
                            <span className="mt-2 text-gray-500 text-lg">
                                {ticket.event.date && new Date(ticket.event.date).toLocaleDateString()} | {ticket.event.location}
                            </span>
                        </div>
                    )}

                    {/* Ticket Breakdown */}
                    <div className="space-y-3 text-sm">
                        {ticket?.tickets?.map((t: any, index: number) => (
                            <div key={index} className="">
                                <div className="flex justify-between mt-1 text-gray-600">
                                    <span>{t.name} × {t.quantity}</span>
                                    <span>₦{(t.price * t.quantity).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between font-bold border-t pt-4 mt-4 text-lg">
                        <span>Total Paid</span>
                        <span>₦{ticket?.amount?.toLocaleString()}</span>
                    </div>

                    {/* Reference */}
                    {ticket?.paymentReference && (
                        <div className="mt-3 text-xs text-gray-500 text-center">
                            Reference: {ticket.paymentReference}
                        </div>
                    )}

                    {/* Download PDF */}
                    <div className="mt-6">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            className={`w-full bg-[#4B22A7] hover:bg-[#3D1C88] text-white py-2 rounded-sm font-semibold transition 
                                ${downloading ? "bg-[#9A84D6] cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            {downloading ? "Generating PDF..." : "DOWNLOAD TICKET PDF"}
                        </button>
                    </div>

                    {/* View Tickets */}
                    <div className="mt-3">
                        <button
                            onClick={() => navigate("/dashboard/attendee/my-tickets")}
                            className="w-full bg-white border border-[#4B22A7] text-[#4B22A7] py-2 rounded-sm font-semibold hover:bg-gray-50 transition"
                        >
                            VIEW MY TICKETS
                        </button>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-3 text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="text-[#4B22A6] font-semibold hover:underline"
                        >
                            Back to Home
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaymentVerifyPage;