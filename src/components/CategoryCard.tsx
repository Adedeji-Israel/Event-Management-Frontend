import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface CategoryCardProps {
  id: string | number;
  name: string;
  events: number;
  icon: ReactNode;
  color: string;
}

const CategoryCard = ({ id, name, events, icon, color }: CategoryCardProps) => {
  return (
    <div className="bg-[#FDFCFB] shadow-md rounded-xl flex flex-col items-center justify-between py-6 space-y-5 hover:shadow-lg transition">

      {/* Icon Circle */}
      <div className={`w-16 h-16 flex items-center justify-center rounded-full text-white text-2xl ${color}`}>
        {icon}
      </div>

      {/* Category Name */}
      <div className="flex-1 flex items-center w-full justify-center px-8">
        <Link to={`/events-category/${id}`} className="w-full">
          <span className="block font-bold text-gray-800 text-center hover:text-[#2F2F89] transition break-words leading-snug">
            {name}
          </span>
        </Link>
      </div>

      {/* Events Count */}
      <div>
        <p className="text-gray-600 text-sm">{events} Events</p>
      </div>
    </div>
  );
};

export default CategoryCard;