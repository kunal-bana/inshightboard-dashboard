import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { dashboardApi } from "./api/dashboardApi";
import { usersApi } from "./api/usersApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dashboardApi.middleware,
      usersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
