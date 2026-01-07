import {
  Box,
  Card,
  Typography,
  Avatar,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <Typography color="text.secondary">
        No user information available.
      </Typography>
    );
  }

  const fullName = user.name ?? "";
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <Box
      display="flex"
      width="100%"
      justifyContent={"center"}
      mt={2}>
      <Box width="100%" maxWidth={800}>
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}>
          {/* HEADER */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            mb={3}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                fontSize: 22,
                fontWeight: 600,
              }}>
              {firstName.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                {fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* DETAILS */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                First Name
              </Typography>
              <Typography fontWeight={500}>
                {firstName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Last Name
              </Typography>
              <Typography fontWeight={500}>
                {lastName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography fontWeight={500}>
                {user.email}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Role
              </Typography>
              <Chip
                label={user.role}
                color={
                  user.role === "Admin"
                    ? "primary"
                    : user.role === "Manager"
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Account Created
              </Typography>
              <Typography fontWeight={500}>
                {user.created}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
}
