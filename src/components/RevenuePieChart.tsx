import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

const GRADIENT_IDS = ["blueGrad", "purpleGrad", "orangeGrad"];

export default function RevenuePieChart({ data }: RevenuePieChartProps) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Revenue by Product
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1976d2" />
              <stop offset="100%" stopColor="#42a5f5" />
            </linearGradient>

            <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7b2ff7" />
              <stop offset="100%" stopColor="#9f67ff" />
            </linearGradient>

            <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9800" />
              <stop offset="100%" stopColor="#ffb74d" />
            </linearGradient>
          </defs>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={`url(#${GRADIENT_IDS[index % GRADIENT_IDS.length]})`}
                style={{ outline: "none" }}/>
            ))}
          </Pie>

          <Tooltip/>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
