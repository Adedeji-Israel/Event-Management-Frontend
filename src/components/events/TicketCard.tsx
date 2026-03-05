import type { Ticket } from "@/types/ticket";

interface TicketCardProps {
    ticket: Ticket;
    isPast?: boolean;
}

const TicketCard = ({ ticket, isPast = false }: TicketCardProps) => {

    const getDaysDifference = (eventDate: string) => {
        const now = new Date();
        const date = new Date(eventDate);

        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const days = ticket.event?.date
        ? getDaysDifference(ticket.event.date)
        : 0;

    return (
        <div className="flex justify-between items-center border-b pb-3 last:border-none">
            <div>
                <p className="font-medium">
                    {ticket.event?.title || "Event removed"}
                </p>

                <p className="text-sm text-gray-500">
                    {ticket.event?.date &&
                        new Date(ticket.event.date).toDateString()}
                </p>

                {/* 🔥 Days Indicator */}
                {ticket.event?.date && (
                    <p
                        className={`text-xs font-medium mt-1 ${isPast
                            ? "text-gray-400"
                            : "text-green-600"
                            }`}
                    >
                        {isPast
                            ? `${Math.abs(days)} days ago`
                            : days === 0
                                ? "Happening Today"
                                : `${days} days remaining`}
                    </p>
                )}
            </div>

            <div className="text-right">
                <p className="text-sm">
                    {ticket.totalQuantity} ticket(s)
                </p>
                <p className="text-sm font-semibold">
                    ₦{(ticket.amount ?? 0).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default TicketCard;
