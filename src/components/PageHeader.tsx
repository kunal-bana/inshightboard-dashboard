import { Box, Typography, Divider } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Box mb={2}>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}

      <Divider sx={{ mt: 1 }} />
    </Box>
  );
}
