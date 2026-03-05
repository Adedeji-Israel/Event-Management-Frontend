import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, MapPin } from "lucide-react"

interface OrganizerCardProps {
    id: number;
    image: string;
    title: string;
    event: string;
    location: string
}

const OrganizerCard = ({ image, title, event, location, id }: OrganizerCardProps) => {
    return (
        <Card className="w-full h-full rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex flex-row items-center px-3 py-4 sm:px-4 sm:py-5">

                {/* Left Image Column */}
                <Link
                    to={`/event-organizers/${id}`}
                    className="
                        w-16 h-16
                        sm:w-20 sm:h-20
                        md:w-24 md:h-24
                        flex-shrink-0
                        rounded-md
                        overflow-hidden
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                    "
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                    />
                </Link>

                {/* Right Content Column */}
                <CardContent className="p-0 ml-3 sm:ml-4 flex flex-col gap-1.5">
                    <Link to={`/event-organizers/${id}`}>
                        <h3
                            className="
                                font-semibold
                                text-sm
                                sm:text-base
                                md:text-lg
                                text-[#283746]
                                hover:text-[#2F2F89]
                                transition
                                leading-snug
                            "
                        >
                            {title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        <span>{event} Event</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}

export default OrganizerCard