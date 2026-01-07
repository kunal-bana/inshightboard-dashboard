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

const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#2e7d32"];

export default function UsersByRoleChart({
  data,
}: UsersByRoleChartProps) {
  const totalUsers = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Users by Role
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
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
                fill={COLORS[index % COLORS.length]}
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
