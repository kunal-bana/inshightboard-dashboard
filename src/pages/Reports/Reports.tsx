import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Report {
  id: number;
  date: string;
  user: string;
  role: string;
  product: string;
  amount: number;
  status: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [role, setRole] = useState("");
  const [product, setProduct] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (product) params.append("product", product);

    fetch(`/api/reports?${params.toString()}`)
      .then((res) => res.json())
      .then(setReports);
  }, [role, product]);

  const totalRevenue = useMemo(
    () => reports.reduce((sum, r) => sum + r.amount, 0),
    [reports]
  );

  const totalOrders = reports.length;

  const trendData = useMemo(
    () =>
      reports.map((r) => ({
        date: r.date,
        amount: r.amount,
      })),
    [reports]
  );

  const columnDefs: ColDef[] = [
  {
    headerName: "Date",
    field: "date",
    flex: 1,
  },
  {
    headerName: "Product",
    field: "product",
    flex: 1,
  },
  {
    headerName: "Amount",
    field: "amount",
    flex: 1,
    valueFormatter: (p) => `₹${p.value.toLocaleString()}`,
  },

  {
    headerName: "User",
    field: "user",
    flex: 1.2,
    hide: isMobile,
  },
  {
    headerName: "Role",
    field: "role",
    flex: 1,
    hide: isMobile,
  },
  {
    headerName: "Status",
    field: "status",
    flex: 1,
    hide: isMobile,
  },
];
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <Box>
      <Box
      sx={{display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 2,
        mt: 1,
        flexWrap: "wrap"}}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Reports
      </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}>
          <TextField
            select
            size="small"
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ minWidth: 160 }}>
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            sx={{ minWidth: 160 }}>
            <MenuItem value="">All Products</MenuItem>
            <MenuItem value="Laptop">Laptop</MenuItem>
            <MenuItem value="Mobiles">Mobiles</MenuItem>
            <MenuItem value="Accessories">Accessories</MenuItem>
          </TextField>
        </Box>
      </Box> 
      {/* KPIs */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              ₹{totalRevenue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Total Orders
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {totalOrders}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Revenue Trend
        </Typography>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#1976d2"
              strokeWidth={2}
              style={{ outline: "none" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Detailed Report
        </Typography>

        <Box className="ag-theme-quartz">
          <AgGridReact
            theme="legacy"
            domLayout="autoHeight"
            rowData={reports}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[5, 10, 15]}/>
        </Box>
      </Paper>
    </Box>
  );
}
