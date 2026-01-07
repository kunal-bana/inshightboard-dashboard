import { http, HttpResponse } from "msw";

const reports = Array.from({ length: 120 }).map((_, i) => {
  const products = ["Laptop", "Mobiles", "Accessories"];
  const users = [
    { name: "Rahul Sharma", role: "Manager" },
    { name: "Amit Malhotra", role: "Admin" },
    { name: "Neha Verma", role: "Manager" },
    { name: "Kunal Bana", role: "Admin" },
    { name: "Vishal Kumar", role: "Manager" },
    { name: "Prakhar Pandey", role: "Manager" },
    { name: "Sneha Kapoor", role: "Admin" },  
    { name: "User 1", role: "User" },
    { name: "User 2", role: "User" },
    { name: "User 3", role: "User" },
    { name: "User 4", role: "User" },
  ];

  const product = products[i % products.length];
  const user = users[i % users.length];

  const quantity = Math.floor(Math.random() * 10) + 1; 
  const unitPrice =
    product === "Laptop" ? 45000 :
    product === "Mobiles" ? 25000 :
    5000;

  return {
    id: i + 1,
    date: `2025-${String((i % 12) + 1).padStart(2, "0")}-15`,
    user: user.name,
    role: user.role,
    product,
    quantity,
    amount: quantity * unitPrice,
    status: "Completed",
  };
});
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
