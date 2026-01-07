import { Card, Avatar, Typography, Box, Chip } from "@mui/material";

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
  created: string;
}

export default function UserInfoCard({ user }: { user: User }) {
  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ width: 56, height: 56 }}>
          {user.name.charAt(0)}
        </Avatar>

        <Box>
          <Typography fontWeight={600}>{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" gap={1} mb={1}>
        <Chip label={user.role} color="primary" size="small" />
        <Chip
          label={user.status}
          color={user.status === "Active" ? "success" : "error"}
          size="small"/>
      </Box>

      <Typography variant="caption" color="text.secondary">
        Joined on {user.created}
      </Typography>
    </Card>
  );
}
