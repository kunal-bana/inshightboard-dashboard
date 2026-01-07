import { Card, Typography } from "@mui/material";

interface SummaryCardProps {
  title: string;
  description: string;
  accentColor?: string;
}

export default function SummaryCard({
  title,
  description,
}: SummaryCardProps) {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
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
      <Typography
        sx={{
          fontSize: "o.85rem",
          color: "#64748B",
          fontWeight: 600,
          textTransform: "inherit",
          letterSpacing: "0.4px",
          mb: 0.5,
          display: "block",
        }}>
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.85rem",
          color: "#374151",
          lineHeight: 1.6,
          fontWeight: 500,
        }}>
        {description}
      </Typography>
    </Card>
  );
}