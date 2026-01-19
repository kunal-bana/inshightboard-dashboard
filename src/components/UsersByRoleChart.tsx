import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography } from "@mui/material";

interface UsersByRole {
  role: string;
  count: number;
  [key: string]: any;
}

interface UsersByRoleChartProps {
  data: UsersByRole[];
}

const GRADIENT_IDS = ["blueGrad", "purpleGrad", "orangeGrad"];

export default function UsersByRoleChart({
  data,}: UsersByRoleChartProps) {
  const totalUsers = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Users by Role
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
          <text
            x="50%"
            y="40%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: 14, fill: "#555" }}>
            Total Users
          </text>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: 22, fontWeight: 600 }}>
            {totalUsers}
          </text>

          <Pie
            data={data}
            dataKey="count"
            nameKey="role"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={`url(#${GRADIENT_IDS[index % GRADIENT_IDS.length]})`}
                style={{ outline: "none" }}/>
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number | undefined, name: string | undefined) => [
              value,
              name,
            ]}/>

          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
