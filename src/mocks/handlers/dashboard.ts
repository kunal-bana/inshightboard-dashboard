import { http, HttpResponse } from "msw";
import type { DashboardStats } from "../../types/dashboard";

const dashboardData: DashboardStats = {
  totalUsers: 124,
  totalRevenue: 1200000,
  growthPercentage: 18,

  revenueTrend: [
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 30000 },
    { month: "Apr", revenue: 75000 },
    { month: "May", revenue: 82000 },
  ],

  usersByRole: [
    { role: "Admin", count: 8 },
    { role: "Manager", count: 16 },
    { role: "Users", count: 100 },
  ],
  revenueByProduct: [
    { name: "Mobiles", value: 18 },
    { name: "Laptops", value: 22 },
    { name: "Accessories", value: 25 },
  ],
};
export const dashboardHandlers = [
  http.get("/api/dashboard", () => {
    return HttpResponse.json(dashboardData);
  }),
];
