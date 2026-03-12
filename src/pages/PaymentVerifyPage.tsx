import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import api from "@/lib/AxiosInterceptor";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import BackgroundImage from "@/assets/images/hero_area_image_3.jpg";
import Logo from "@/assets/images/logo.png";

type Status = "verifying" | "success" | "failed" | "pending";

const PaymentVerifyPage = () => {

    const [params] = useSearchParams();
    const navigate = useNavigate();

    const reference = params.get("reference") || params.get("trxref");

    const [status, setStatus] = useState<Status>("verifying");
    const [ticket, setTicket] = useState<any>(null);
    const [downloading, setDownloading] = useState(false);
    const [countdown, setCountdown] = useState(5);

    /* ================= PAYMENT STATUS POLLING ================= */
    useEffect(() => {

        if (!reference) {
            setStatus("failed");
            return;
        }

        let interval: any;

        const checkStatus = async () => {
            try {
                const res = await api.get(`/tickets/payment/status?reference=${reference}`);

                const ticketData = res.data.ticket;

                setTicket(ticketData);

                if (ticketData.status === "paid") {
                    setStatus("success");
                    clearInterval(interval);
                } else {
                    setStatus("pending");
                }
            } catch (err) {
                console.error("Payment status error:", err);
                setStatus("pending");
            }
        };

        checkStatus();

        interval = setInterval(checkStatus, 3000);

        return () => clearInterval(interval);

    }, [reference]);

    useEffect(() => {
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    /* ================= SUCCESS REDIRECT ================= */
    useEffect(() => {

        if (status !== "success") return;

        if (countdown === 0) {
            navigate("/dashboard/attendee/my-tickets");
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);

    }, [status, countdown, navigate]);

    /* ================= DOWNLOAD PDF ================= */
    const handleDownloadPDF = async () => {

        if (!ticket?._id) return;

        try {

            setDownloading(true);

            const response = await api.get(
                `/tickets/${ticket._id}/download/pdf`,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `${ticket.ticketId || "ticket"}.pdf`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error("Download failed:", err);

        } finally {

            setDownloading(false);

        }
    };

    /* ================= LOADING ================= */
    if (status === "verifying" || status === "pending") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-purple-600" />
                    <p className="mt-4 text-gray-600">
                        {status === "verifying"
                            ? "Verifying your payment..."
                            : "Processing confirmation..."}
                    </p>
                </div>
            </div>
        );
    }

    /* ================= FAILED ================= */
    if (status === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-10 rounded-2xl shadow max-w-md w-full text-center">

                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

                    <h2 className="text-2xl font-bold mb-3">
                        Payment Failed
                    </h2>

                    <p className="text-gray-600 mb-6">
                        We couldn't confirm your payment.
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

    /* ================= SUCCESS ================= */
    return (
        <div
            className="w-full min-h-screen flex items-center justify-center bg-cover bg-center p-6"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10 text-center">

                <img src={Logo} alt="logo" className="w-44 mx-auto mb-6" />

                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-[#4B22A6]">
                    Payment Successful
                </h2>

                <p className="text-gray-600 mt-2">
                    Your tickets have been confirmed and sent to your email.
                </p>

                <p className="mt-1 font-semibold text-[#4B22A6] bg-purple-50 inline-block px-3 py-1 rounded-md">
                    {ticket?.email}
                </p>

                {/* EVENT INFO */}

                {ticket?.event && (
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">

                        <h3 className="font-semibold text-lg text-purple-600">
                            {ticket.event.title}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            {new Date(ticket.event.date).toLocaleDateString()} •{" "}
                            {ticket.event.location}
                        </p>

                    </div>
                )}

                {/* ACTION BUTTONS */}

                <div className="mt-8 space-y-3">

                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="w-full bg-[#4B22A7] text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
                    >
                        {downloading ? "Generating Ticket..." : "Download Ticket"}
                    </button>

                    <button
                        onClick={() => navigate("/dashboard/attendee/my-tickets")}
                        className="w-full border border-[#4B22A7] text-[#4B22A7] py-3 rounded-md font-semibold hover:bg-purple-50 transition"
                    >
                        View My Tickets
                    </button>

                </div>

                <p className="text-sm text-gray-500 mt-6">
                    Redirecting to dashboard in {countdown}s...
                </p>

                <p className="text-xs text-gray-500 mt-2">
                    If you don’t see it, check your spam or promotions folder.
                </p>
            </div>
        </div>
    );
};

export default PaymentVerifyPage;