export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  growthPercentage: number;

  revenueTrend: {
    month: string;
    revenue: number;
  }[];

  revenueByProduct: {
    name: string;
    value: number;
  }[];

  usersByRole: {
    role: string;
    count: number;
  }[];
}
