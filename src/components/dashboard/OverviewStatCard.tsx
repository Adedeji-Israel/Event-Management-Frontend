import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  growth?: number; 
}

const OverviewStatCard = ({ label, value, icon, growth }: Props) => {
  const isPositive = (growth ?? 0) >= 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>

        {growth !== undefined && (
          <div
            className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            {Math.abs(growth)}%
            <span className="text-gray-400 font-normal ml-1">
              vs last month
            </span>
          </div>
        )}
      </div>

      <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>
    </div>
  );
};

export default OverviewStatCard;
