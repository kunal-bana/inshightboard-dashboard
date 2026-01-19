import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {Box,Typography} from "@mui/material";
const data = [
  { month: "Jan", revenue: 40000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 30000 },
  { month: "Apr", revenue: 75000 },
  { month: "May", revenue: 82000 },
];

export default function RevenueLineChart() {
  return (
    <Box> 
        <Typography variant="subtitle1" fontWeight={600} mb={1}> 
            Revenue Trend (Monthly) 
        </Typography>
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff9800" />
            <stop offset="100%" stopColor="#ffb74d" />
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value: number | undefined) => value !== undefined ? `₹${value.toLocaleString()}` : ''} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="url(#revenueGradient)"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          style={{ outline: "none" }}/>
      </LineChart>
    </ResponsiveContainer>
  </Box>
  );
}
