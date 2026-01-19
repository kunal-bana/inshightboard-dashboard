import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import UserDetail from "../pages/UserDetail/UserDetail";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import Login from "../pages/Auth/Login";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
            <MainLayout />
          </ProtectedRoute>
        }>

        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
              <Dashboard />
            </ProtectedRoute>
          }/>

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <Users />
            </ProtectedRoute>
          }/>

        <Route
          path="users/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <UserDetail />
            </ProtectedRoute>
          }/>

        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["Admin","Manager"]}>
              <Reports />
            </ProtectedRoute>
          }/>

        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
              <Settings />
            </ProtectedRoute>
          }/>

        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
