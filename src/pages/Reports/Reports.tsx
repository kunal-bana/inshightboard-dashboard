import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface Report {
  id: number;
  date: string;
  user: string;
  role: string;
  product: string;
  amount: number;
  status: string;
  quantity: number;
}

interface AggregatedRow {
  user: string;
  product: string;
  quantity: number;
  amount: number;
  status?: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

const filterInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#e0e4ec",
    },
    "&:hover fieldset": {
      borderColor: "#d0d4dc",
    },
  },
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [role, setRole] = useState("");
  const [product, setProduct] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (product) params.append("product", product);

    fetch(`/api/reports?${params.toString()}`)
      .then((res) => res.json())
      .then(setReports);
  }, [role, product]);

  const tableData = useMemo(() => {
    const map = new Map<string, AggregatedRow>();

    reports.forEach((r) => {
      const key = `${r.user}-${r.product}`;

      if (!map.has(key)) {
        map.set(key, {
          user: r.user,
          product: r.product,
          quantity: r.quantity,
          amount: r.amount,
          status: r.status,
        });
      } else {
        const existing = map.get(key)!;
        existing.quantity += r.quantity;
        existing.amount += r.amount;
      }
    });

    return Array.from(map.values());
  }, [reports]);

  const totalRevenue = useMemo(
    () => tableData.reduce((sum, r) => sum + r.amount, 0),
    [tableData]
  );

  const totalProductsSold = useMemo(
    () => tableData.reduce((sum, r) => sum + r.quantity, 0),
    [tableData]
  );

  const monthlyTrend: MonthlyRevenue[] = useMemo(() => {
    const map = new Map<string, number>();

    reports.forEach((r) => {
      const month = new Date(r.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      map.set(month, (map.get(month) || 0) + r.amount);
    });

    return Array.from(map.entries()).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [reports]);

  const columnDefs: ColDef[] = [
    { headerName: "User", field: "user", flex: 1.5 },
    { headerName: "Product", field: "product", flex: 1 },
    { headerName: "Quantity Sold", field: "quantity", flex: 1 },
    {
      headerName: "Amount",
      field: "amount",
      flex: 1,
      valueFormatter: (p) => `₹${p.value.toLocaleString()}`,
    },
    { headerName: "Status", field: "status", flex: 1 },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", 
          flexWrap: "wrap",
          mb: 2,
          mt: 2,
          gap: 2,
        }}>
        <Typography variant="h5" fontWeight={600}>
          Reports
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            select
            size="small"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ ...filterInputStyle, minWidth: 160 }}
            SelectProps={{
              displayEmpty: true,
              IconComponent: KeyboardArrowDownIcon,
              renderValue: (selected: any) => {
                if (!selected) {
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                      <FilterListIcon sx={{ fontSize: 18 }} />
                      Filter by Role
                    </Box>
                  );
                }
                return selected;
              },
            }}>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            sx={{ ...filterInputStyle, minWidth: 160 }}
            SelectProps={{
              displayEmpty: true,
              IconComponent: KeyboardArrowDownIcon,
              renderValue: (selected: any) => {
                if (!selected) {
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                      <FilterListIcon sx={{ fontSize: 18 }} />
                      Product
                    </Box>
                  );
                }
                return selected;
              },
            }}>
            <MenuItem value="Laptop">Laptop</MenuItem>
            <MenuItem value="Mobiles">Mobiles</MenuItem>
            <MenuItem value="Accessories">Accessories</MenuItem>
          </TextField>
        </Box>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption">Total Revenue</Typography>
            <Typography variant="h6" fontWeight={600}>
              ₹{totalRevenue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{xs: 12, md: 6}}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption">Products Sold</Typography>
            <Typography variant="h6" fontWeight={600}>
              {totalProductsSold}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Monthly Revenue Trend
        </Typography>
        <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />            
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1976d2"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Sales Breakdown
        </Typography>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box className="ag-theme-quartz" sx={{ minWidth: 720 }}>
            <AgGridReact
              theme="legacy"
              domLayout="autoHeight"
              rowData={tableData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20]}
              onGridReady={(params) => params.api.sizeColumnsToFit()}
              onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}