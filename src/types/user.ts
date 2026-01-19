export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager"|"Employee";
  status: "Active" | "Inactive";
  created: string;
}
