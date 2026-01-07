import { Grid, Box, Typography,Button,Paper } from "@mui/material";
import { useEffect} from "react";

import KpiCard from "../../components/KpiCard";
import SummaryCard from "../../components/SummaryCard";
import RevenueLineChart from "../../components/RevenueLineChart";
import RevenuePieChart from "../../components/RevenuePieChart";
import UsersByRoleChart from "../../components/UsersByRoleChart";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  transformRevenueByProduct,
  transformUsersByRole,
} from "../../utils/dashboardTransform";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { canViewRevenue } from "../../utils/permissions";
import { useDashboard } from "../../hooks/useDashboard";
import { formatCurrency } from "../../utils/format";

export default function Dashboard() {
  const {stats,loading,error,refetch } = useDashboard();
  const role = useSelector((state: RootState) => state.auth.user?.role);
  useEffect(() => {
    document.title = "Dashboard | Admin Panel";
  }, []);

  if (loading) {
  return <Typography color="text.secondary">
  Fetching latest dashboard insights…
  </Typography>
}
if (error) {
  return (
    <Box>
      <Typography color="error">
        We couldn’t load the dashboard data right now.
      </Typography>
      <Button variant="text" size="small" onClick={refetch} sx={{ mt: 0.5 }}>
        Try again
      </Button>
      <Typography variant="body2" color="text.secondary">
        You can also refresh the page if the problem persists.
      </Typography>
    </Box>
  );
}
if (!stats) {
  return <Typography>No data available.</Typography>;
}
const revenueByProduct = transformRevenueByProduct(stats);
const usersByRole = transformUsersByRole(stats);

  return (
    <Box>
      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <KpiCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<PeopleAltOutlinedIcon />}/>
        </Grid>
          {canViewRevenue(role) && (
        <Grid size={{ xs: 12, md: 4 }}>
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<CurrencyRupeeIcon />}/>
        </Grid>)}

        <Grid size={{ xs: 12, md: 4 }}>
          <KpiCard
            title="Growth"
            value={`${stats.growthPercentage}%`}
            growth="+4.2% compared to last month"
            icon={<TrendingUpIcon />}
            positive/>
        </Grid>
      </Grid>
      {canViewRevenue(role) && (
      <Grid container spacing={3} mt={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Paper sx={{ p: 2 }}>
            <RevenueLineChart />
          </Paper>
        </Grid>
       </Grid>)} 
      <Grid container spacing={3} mt={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <RevenuePieChart data={revenueByProduct} />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2 }}>
          <UsersByRoleChart data={usersByRole} />
        </Paper>
      </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SummaryCard
            title="Revenue Overview"
            description="The company has experienced consistent revenue growth over recent months. Electronics products such as mobiles, laptops, and accessories are driving the majority of sales."/>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SummaryCard
            title="User & Business Insights"
            description="User registrations have increased steadily, indicating improved customer engagement. Continued focus on product quality and service can further enhance growth."/>
        </Grid>
      </Grid>
    </Box>
  );
}
