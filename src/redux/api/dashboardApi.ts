import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type{ DashboardStats } from "../../types/dashboard";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
        query: () => "/dashboard",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
