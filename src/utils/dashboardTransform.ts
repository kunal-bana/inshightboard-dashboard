import type { DashboardStats } from "../types/dashboard";

export function transformRevenueByProduct(stats: DashboardStats) {
  return stats.revenueByProduct.map(item => ({
    name: item.name,
    value: item.value,
  }));
}

export function transformUsersByRole(stats: DashboardStats) {
  return stats.usersByRole.map(item => ({
    role: item.role,
    count: item.count,
  }));
}

export function transformRevenueTrend(stats: DashboardStats) {
  return stats.revenueTrend.map(item => ({
    label: item.month,
    value: item.revenue,
  }));
}
