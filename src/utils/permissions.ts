import type { UserRole } from "../redux/slices/authSlice";

export function canViewRevenue(role?: UserRole) {
  return role === "Admin" || role === "Manager";
}
export function canViewUsers(role?: UserRole) {
  return role === "Admin" || role === "Manager";
}
export function canViewReports(role?: UserRole) {
  return role === "Admin" || role === "Manager";
}
export function canDeleteUsers(role?: UserRole) {
  return role === "Admin";
}

