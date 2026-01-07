import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export type UserRole = "Admin" | "Manager" | "User";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  rememberMe: boolean;
}
const getRoleFromEmail = (email: string): UserRole => {
  const lower = email.toLowerCase();

  if (lower.endsWith("admin@company.com")) return "Admin";
  if (lower.endsWith("manager@company.com")) return "Manager";
  return "User";
};
const savedAuth = localStorage.getItem("auth");

const initialState: AuthState = savedAuth
  ? JSON.parse(savedAuth)
  : {
      isAuthenticated: false,
      user: null,
      rememberMe: false,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
  state,
  action: PayloadAction<{ name: string; email: string; created: string, rememberMe: boolean, id: number }>
) => {
  const derivedRole = getRoleFromEmail(action.payload.email);

  state.isAuthenticated = true;
  state.rememberMe = action.payload.rememberMe;
  state.user = {
    id: action.payload.id,
    name: action.payload.name,
    email: action.payload.email,
    role: derivedRole,
    created: action.payload.created,
  };
   if (state.rememberMe) {
    localStorage.setItem("auth", JSON.stringify(state));
  }
},

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.rememberMe = false;
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
