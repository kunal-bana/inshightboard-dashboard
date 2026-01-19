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
  variant?: "purple" | "blue" | "orange";
}
 const gradients = {
  purple: "linear-gradient(135deg, #7b2ff7, #9f67ff)",
  blue: "linear-gradient(135deg, #1976d2, #42a5f5)",
  orange: "linear-gradient(135deg, #ff9800, #ffb74d)",
};
export default function KpiCard({
  title,
  value,
  icon,
  growth,
  positive = true,
  trend,
  loading = false,
  suffix,
  variant,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card
        sx={{
          p: 2,
          height: 120,
          borderRadius: 3,
          background: gradients[variant ?? "purple"],
        }}>
        <Skeleton width="50%" height={14} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
        <Skeleton width="60%" height={30} sx={{ bgcolor: "rgba(255,255,255,0.3)", my: 1 }} />
        <Skeleton width="40%" height={12} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
      </Card>
    );
  }

  const getTrendColor = () => {
    if (!trend) return "#E5E7EB";
    if (trend === "up") return positive ? "#BBF7D0" : "#FECACA";
    if (trend === "down") return positive ? "#FECACA" : "#BBF7D0";
    return "#E5E7EB";
  };

  const getTrendIcon = () =>
    trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <Card
      sx={{
        height: 100,
        borderRadius: 3,
        p: 1,
        color: "#fff",
        background: gradients[variant ?? "purple"],
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}>
      <Box
        sx={{
          position: "absolute",
          right: -10,
          top: -10,
          opacity: 0.25,
          "& svg": {
            fontSize: 120,
            color: "#fff",
          },
        }}>
        {icon}
      </Box>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          opacity: 0.9,
          letterSpacing: "0.3px",
        }}>
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: 800,
          lineHeight: 1.1,
          mt: 0.5,
        }}>
        {value}
        {suffix && (
          <span
            style={{
              fontSize: "0.55em",
              marginLeft: 4,
              opacity: 0.85,
            }}>
            {suffix}
          </span>
        )}
      </Typography>

      {growth && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            fontWeight: 700,
            color: getTrendColor(),
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}>
          <span>{getTrendIcon()}</span>
          {growth}
        </Typography>
      )}
    </Card>
  );
}
