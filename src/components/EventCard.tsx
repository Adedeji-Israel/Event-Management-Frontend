import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { User } from "@/types/user";

interface EventCardProps {
  id: string | number;
  image: string;
  title: string;
  date: string;
  organizer: string | User;
}

const EventCard = ({
  id,
  image,
  title,
  date,
  organizer,
}: EventCardProps) => {
  const organizerName =
    typeof organizer === "string"
      ? organizer
      : organizer.fullName;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full max-w-sm"
    >
      <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition h-full flex flex-col">
        <div className="relative w-full overflow-hidden">
          <Link to={`/events/${id}`}>
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>

        <CardContent className="space-y-7 flex-grow">
          <div>
            <Link to={`/events/${id}`}>
              <h3 className="text-xl font-bold leading-snug hover:text-[#2F2F89] transition">
                {title}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {date}
          </div>
        </CardContent>

        <CardFooter className="pb-6 flex items-center justify-between">
          <div>
            <p className="text-md">Organized By</p>
            <span className="text-lg text-[#FE2676] font-semibold">
              {organizerName}
            </span>
          </div>

          <Button
            asChild
            variant="ghost"
            className="text-[#36358F] text-lg rounded-sm border-2 border-[#36358F] hover:text-white hover:bg-[#36358F]"
          >
            <Link to={`/events/${id}/book-ticket`}>
              BUY NOW
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EventCard;