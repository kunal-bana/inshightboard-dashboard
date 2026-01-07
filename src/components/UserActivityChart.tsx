import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, Typography, Box } from "@mui/material";

interface Activity {
  day: string;
  actions: number;
}

export default function UserActivityChart({
  data,
}: {
  data: Activity[];
}) {
  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography fontWeight={600} mb={1}>
        Activity (Last 7 days)
      </Typography>

      <Box height={220}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="actions"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}/>
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
