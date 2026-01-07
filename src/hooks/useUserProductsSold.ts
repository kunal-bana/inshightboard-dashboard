import { useEffect, useState } from "react";

export function useUserProductsSold(userId?: number) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    fetch(`/api/users/${userId}/products-sold`)
      .then((res) => res.json())
      .then((data) => setCount(data.totalProductsSold))
      .finally(() => setLoading(false));
  }, [userId]);

  return { count, loading };
}
