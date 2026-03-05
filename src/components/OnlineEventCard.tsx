import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "@/types/user";

interface OnlineEventCardProps {
  id: string;
  image: string;
  title: string;
  date: string;
  organizer: User;
}

const OnlineEventCard = ({ image, title, date, organizer, id }: OnlineEventCardProps) => {
  const organizerName =
    typeof organizer === "string"
      ? organizer
      : organizer.fullName;
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full h-full"
        >
            <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition h-full flex gap-1 flex-row">
                {/* Left Image */}
                <div className="relative w-2/5 overflow-hidden">
                    <Link to={`/online-events/${id}`}>
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    </Link>
                </div>

                {/* Right Content */}
                <div className="w-3/5 flex flex-col justify-between py-6 space-y-2">
                    <CardContent className="flex-grow space-y-6">
                        {/* Title */}
                        <div>
                            <Link to={`/online-events/${id}`}>
                                <h3 className="text-xl font-semibold leading-snug hover:text-[#283746] transition">
                                    {title}
                                </h3>
                            </Link>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {date}
                        </div>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="flex items-center justify-between">
                        <div>
                            <p className="text-md">Organized By</p>
                            <span className="text-lg text-[#FE2676] font-semibold">
                                {organizerName}
                            </span>
                        </div>

                        <Button
                            asChild
                            variant="ghost"
                            className="text-[#36358F] text-sm rounded-sm border-2 border-[#36358F] hover:text-white hover:bg-[#36358F] transition-colors duration-600 !px-4 !py-5"
                        >
                            <Link to={`/online-events/${id}`} className="flex items-center gap-2">
                                BUY NOW
                            </Link>
                        </Button>
                    </CardFooter>
                </div>
            </Card>
        </motion.div>
    );
};

export default OnlineEventCard;
