import { createSlice } from "@reduxjs/toolkit";
import type{ PayloadAction } from "@reduxjs/toolkit";
import type{ DashboardStats } from "../../types/dashboard";

interface DashboardState {
  stats: DashboardStats | null;
}

const initialState: DashboardState = {
  stats: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardStats(state, action: PayloadAction<DashboardStats>) {
      state.stats = action.payload;
    },
    clearDashboardStats(state) {
      state.stats = null;
    },
  },
});

export const { setDashboardStats, clearDashboardStats } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
