import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Box, Typography } from "@mui/material";

interface RevenueByProduct {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface RevenuePieChartProps {
  data: RevenueByProduct[];
}

const COLORS = ["#1976d2", "#9c27b0", "#ff9800"];

export default function RevenuePieChart({
  data,
}: RevenuePieChartProps) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Revenue by Product
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                    style={{ outline: "none" }}
              />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
