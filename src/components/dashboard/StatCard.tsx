import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  isCurrency?: boolean; // optional flag to show ₦
}

const StatCard = ({ title, value, icon, isCurrency = false }: StatCardProps) => {
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <div className="w-4 h-4">{icon}</div>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-medium mb-0.5">{title}</p>
          <h2 className="text-xl font-semibold text-gray-900">
            {isCurrency ? `₦${Number(value).toLocaleString()}` : value}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StatCard;