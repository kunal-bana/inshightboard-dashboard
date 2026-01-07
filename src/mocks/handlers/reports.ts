import { http, HttpResponse } from "msw";

const reports = [
  {
    id: 1,
    date: "2024-06-01",
    user: "Rahul Sharma",
    role: "Manager",
    product: "Laptop",
    amount: 45000,
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-06-02",
    user: "Neha Verma",
    role: "Manager",
    product: "Accessories",
    amount: 12000,
    status: "Completed",
  },
  {
    id: 3,
    date: "2024-06-03",
    user: "Kunal Bana",
    role: "Admin",
    product: "Mobiles",
    amount: 30000,
    status: "Pending",
  },
  {
    id: 4,
    date: "2024-07-10",
    user: "Prakhar Pandey",
    role: "Manager",
    product: "Mobiles",
    amount: 25000,
    status: "Completed",
  },
];

export const reportsHandlers = [
  http.get("/api/reports", ({ request }) => {
    const url = new URL(request.url);

    const role = url.searchParams.get("role");
    const product = url.searchParams.get("product");

    const filtered = reports.filter((r) => {
      const roleMatch = role ? r.role === role : true;
      const productMatch = product ? r.product === product : true;
      return roleMatch && productMatch;
    });

    return HttpResponse.json(filtered);
  }),
];
