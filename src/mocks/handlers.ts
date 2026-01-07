import { http, HttpResponse } from "msw";
import { dashboardHandlers } from "./handlers/dashboard";
import type { User } from "../types/user";
import { reportsHandlers } from "./handlers/reports";
const users: User[] = [
  {
    id: 1,
    name: "Kunal Bana",
    email: "admin@company.com",
    role: "Admin",
    status: "Active",
    created: "2024-01-12",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "manager@company.com",
    role: "Manager",
    status: "Active",
    created: "2024-02-03",
  },
  {
    id: 3,
    name: "Neha Verma",
    email: "neha.manager@company.com",
    role: "Manager",
    status: "Inactive",
    created: "2024-03-18",
  },
  {
    id: 4,
    name: "Vishal Kumar",
    email: "vishal.manager@company.com",
    role: "Manager",
    status: "Active",
    created: "2024-04-20",
  },
  {
    id: 5,
    name: "Prakhar Pandey",
    email: "prakhar.manager@company.com",
    role: "Manager",
    status: "Active",
    created: "2024-05-25",
  },
  {
    id: 6,
    name: "Amit Malhotra",
    email: "amit.admin@company.com",
    role: "Admin",
    status: "Active",
    created: "2024-06-02",
  },
  {
    id: 7,
    name: "Sneha Kapoor",
    email: "sneha.admin@company.com",
    role: "Admin",
    status: "Active",
    created: "2024-06-10",
  },
  {
    id: 8,
    name: "Rohit Mehta",
    email: "rohit.admin@company.com",
    role: "Admin",
    status: "Inactive",
    created: "2024-06-18",
  },
  {
    id: 9,
    name: "Anjali Singh",
    email: "anjali.admin@company.com",
    role: "Admin",
    status: "Active",
    created: "2024-06-25",
  },

  // 🔹 Additional Managers (4)
  {
    id: 10,
    name: "Deepak Yadav",
    email: "deepak.manager@company.com",
    role: "Manager",
    status: "Active",
    created: "2024-07-01",
  },
  {
    id: 11,
    name: "Pooja Mishra",
    email: "pooja.manager@company.com",
    role: "Manager",
    status: "Active",
    created: "2024-07-08",
  },
  {
    id: 12,
    name: "Saurabh Jain",
    email: "saurabh.manager@company.com",
    role: "Manager",
    status: "Inactive",
    created: "2024-07-15",
  },
  {
    id: 13,
    name: "Nitin Aggarwal",
    email: "nitin.manager@company.com",
    role: "Manager",
    status: "Active",
    created: "2024-07-22",
  },

  ...Array.from({ length: 101 }).map((_, i) => ({
  id: i + 14,
  name: `User ${i + 1}`,
  email: `user${i + 1}@company.com`,
  role: "User" as const,
  status: (i % 7 === 0 ? ("Inactive" as const) : ("Active" as const)),
  created: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String(
    (i % 28) + 1
  ).padStart(2, "0")}`,
})),
];

export const handlers = [
  ...dashboardHandlers,
  ...reportsHandlers,
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";
    const status = url.searchParams.get("status") || "";

    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role ? user.role === role : true;
      const matchesStatus = status ? user.status === status : true;

      return matchesSearch && matchesRole && matchesStatus;
    });

    return HttpResponse.json(filteredUsers);
  }),

  // User detail
  http.get("/api/users/:id", ({ params }) => {
    const user = users.find(
      (u) => u.id === Number(params.id)
    );
    return HttpResponse.json(user);
  }),

  // User activity
  http.get("/api/users/:id/activity", ({ params }) => {
    const id = Number(params.id);
    return HttpResponse.json([
      { day: "Mon", actions: id + 1 },
      { day: "Tue", actions: id + 3 },
      { day: "Wed", actions: id + 2 },
      { day: "Thu", actions: id + 1 },
      { day: "Fri", actions: id + 2 },
      { day: "Sat", actions: id + 3 },
      { day: "Sun", actions: id + 1 },
    ]);
  }),

  http.get("/api/users/:id/products-sold", ({ params }) => {
  const id = Number(params.id);
  return HttpResponse.json({
    totalProductsSold: id * 4 + 12,
  });
}),

  // User history
  http.get("/api/users/:id/history", ({ params }) => {
    const id = Number(params.id);
    return HttpResponse.json([
      { action: "Login", date: "2024-06-01", ip: `192.168.1.${id}` },
      { action: "Viewed report", date: "2024-06-02", ip: `192.168.1.${id + 5}` },
    ]);
  }),
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";
    const status = url.searchParams.get("status") || "";

    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role ? user.role === role : true;
      const matchesStatus = status ? user.status === status : true;

      return matchesSearch && matchesRole && matchesStatus;
    });

    return HttpResponse.json(filteredUsers, { status: 200 });
  }),
];
