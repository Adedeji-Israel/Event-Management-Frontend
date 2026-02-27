// TicketSalesChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  range: "monthly" | "weekly";
}

const monthlyData = [
  { day: "1", tickets: 30 },
  { day: "5", tickets: 45 },
  { day: "10", tickets: 60 },
  { day: "15", tickets: 40 },
  { day: "20", tickets: 90 },
  { day: "25", tickets: 75 },
  { day: "30", tickets: 120 },
];

const weeklyData = [
  { day: "Mon", tickets: 12 },
  { day: "Tue", tickets: 18 },
  { day: "Wed", tickets: 9 },
  { day: "Thu", tickets: 22 },
  { day: "Fri", tickets: 30 },
  { day: "Sat", tickets: 27 },
  { day: "Sun", tickets: 35 },
];

const TicketSalesChart = ({ range }: Props) => {
  const data = range === "monthly" ? monthlyData : weeklyData;

  return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: -10, bottom: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* X Axis */}
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            label={{
              value: range === "monthly" ? "Days" : "Day of Week",
              position: "insideBottom",
              offset: -10,
              fontSize: 12,
            }}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 12 }}
            width={35}
            label={{
              // value: "Tickets Sold", 
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
            }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="tickets"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4 }}
            isAnimationActive
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
  );
};

export default TicketSalesChart;
