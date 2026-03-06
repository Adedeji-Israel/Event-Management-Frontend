import type { Ticket } from "@/types/ticket";
import type { Event } from "@/types/event";

interface TicketCardProps {
    ticket?: Ticket;
    event?: Event;
    isPast?: boolean;
}

const TicketCard = ({ ticket, event, isPast = false }: TicketCardProps) => {
    const eventData = ticket?.event || event;

    if (!eventData) return null;

    const getDaysDifference = (eventDate: string) => {
        const now = new Date();
        const date = new Date(eventDate);
        return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    const days = eventData.date ? getDaysDifference(eventData.date) : 0;

    return (
        <div className="flex justify-between items-center border-b pb-3 last:border-none">
            <div>
                <p className="font-medium">{eventData.title}</p>
                <p className="text-sm text-gray-500">{eventData.date && new Date(eventData.date).toDateString()}</p>

                {eventData.date && (
                    <p className={`text-xs font-medium mt-1 ${isPast ? "text-gray-400" : "text-green-600"}`}>
                        {isPast
                            ? `${Math.abs(days)} days ago`
                            : days === 0
                            ? "Happening Today"
                            : `${days} days remaining`}
                    </p>
                )}
            </div>

            <div className="text-right">
                {/* User ticket display */}
                {ticket && (
                    <>
                        <p className="text-sm">{ticket.totalQuantity} ticket(s)</p>
                        <p className="text-sm font-semibold">₦{(ticket.amount ?? 0).toLocaleString()}</p>
                    </>
                )}

                {/* Organizer event stats */}
                {event && (
                    <>
                        <p className="text-sm">{event.bookingsCount ?? 0} bookings</p>
                        <p className="text-sm font-semibold">₦{(event.revenue ?? 0).toLocaleString()}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default TicketCard;