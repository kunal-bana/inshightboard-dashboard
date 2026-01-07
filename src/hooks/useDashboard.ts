import { useEffect, useState } from "react";
import type { DashboardStats } from "../types/dashboard";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboard = () => {
    setLoading(true);
    setError(false);

    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { stats, loading, error, refetch: fetchDashboard };
}
