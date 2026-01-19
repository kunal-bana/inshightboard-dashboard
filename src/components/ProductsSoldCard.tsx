import { Paper, Typography, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface Props {
  value?: number | null;
}

export default function ProductsSoldCard({ value }: Props) {
  return (
    <Paper
      sx={{
        height: 100,
        borderRadius: 3,
        p: 1,
        color: "#fff",
        background: "linear-gradient(135deg, #ff9800, #ffb74d)",
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
        <ShoppingCartIcon />
      </Box>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          opacity: 0.9,
          letterSpacing: "0.3px",
        }}>
        Products Sold
      </Typography>

      <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: 800,
          lineHeight: 1.1,
          mt: 0.5,
        }}>
        {value ?? 0}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          opacity: 0.85,
          fontWeight: 600,
          mt: 0.5,
        }}>
        Your contribution
      </Typography>
    </Paper>
  );
}
