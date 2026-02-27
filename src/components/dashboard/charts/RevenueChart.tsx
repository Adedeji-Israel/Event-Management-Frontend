// RevenueChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  range: "monthly" | "weekly";
}

const monthlyRevenue = [
  { name: "Week 1", revenue: 1200 },
  { name: "Week 2", revenue: 2100 },
  { name: "Week 3", revenue: 1800 },
  { name: "Week 4", revenue: 2900 },
];

const weeklyRevenue = [
  { name: "Mon", revenue: 200 },
  { name: "Tue", revenue: 350 },
  { name: "Wed", revenue: 280 },
  { name: "Thu", revenue: 400 },
  { name: "Fri", revenue: 520 },
  { name: "Sat", revenue: 610 },
  { name: "Sun", revenue: 700 },
];

const RevenueChart = ({ range }: Props) => {
  const data = range === "monthly" ? monthlyRevenue : weeklyRevenue;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 5, left: 3, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} width={30} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#22c55e"
          fill="#22c55e33"
          strokeWidth={3}
          isAnimationActive
          animationDuration={800}
        />
      </AreaChart>

    </ResponsiveContainer>
  );
};

export default RevenueChart;
