import { Card, Box, Typography, Skeleton } from "@mui/material";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  growth?: string | number;
  positive?: boolean;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
  suffix?: string;
}

export default function KpiCard({
  title,
  value,
  icon,
  growth,
  positive = true,
  trend,
  loading = false,
  suffix,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card sx={{ p: 1.5, height: 100, borderRadius: 2, background: "rgba(33, 150, 243, 0.03)" }}>
        <Skeleton width="50%" height={12} sx={{ mb: 0.5 }} />
        <Skeleton width="60%" height={28} sx={{ my: 0.5 }} />
        <Skeleton width="40%" height={10} />
      </Card>
    );
  }

  const getTrendColor = () => {
    if (!trend) return "#6B7280";
    return trend === "up" ? (positive ? "#10B981" : "#EF4444") : trend === "down" ? (positive ? "#EF4444" : "#10B981") : "#6B7280";
  };

  const getTrendIcon = () => (trend === "up" ? "↑" : trend === "down" ? "↓" : "→");

  return (
    <Card
      sx={{
        p: 1.5,
        height: 100,
        borderRadius: 2,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",  
          borderColor: "#3B82F6",
        },
      }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
        <Box flex={1} minWidth={0}>
          <Typography
            variant="caption"
            sx={{
              color: "#64748B",
              fontWeight: 600,
              textTransform: "inherit",
              letterSpacing: "0.4px",
              display: "block",
              mb: 0.3,
              fontSize: "1rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}>
            {value}
            {suffix && (
              <span style={{ fontSize: "0.55em", marginLeft: 3, WebkitTextFillColor: "#94A3B8", color: "#94A3B8" }}>
                {suffix}
              </span>
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            "& svg": { width: 90, height: 90, color: "#3B82F6" },
          }}>
          {icon}
        </Box>
      </Box>

      {growth && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mt: 0.1 }}>
          <Typography
            variant="caption"
            sx={{
              color: getTrendColor(),
              fontWeight: 700,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 0.2,
            }}>
            <span>{getTrendIcon()}</span>
            {growth}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
