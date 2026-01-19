import {
  Box,
  Card,
  Typography,
  Avatar,
  Grid,
  Divider,
  Chip,
  Paper,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography color="text.secondary">
          No user information available.
        </Typography>
      </Box>
    );
  }

  const fullName = user.name ?? "";
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: "20px",
          border: "1px solid #edf2f7",
          background: "linear-gradient(135deg, #a079f4ff 0%, #554cffff 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}>
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}/>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          textAlign={{ xs: "center", sm: "left" }}>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              border: "4px solid rgba(255, 255, 255, 0.3)",
              fontSize: "3rem",
              fontWeight: 700,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}>
            {firstName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {fullName}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ xs: "center", sm: "flex-start" }}>
              <Chip
                icon={<AdminPanelSettingsIcon style={{ color: "#fff" }} />}
                label={user.role}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                }}
              />
              <Chip
                label="Account Active"
                sx={{
                  bgcolor: "#10b981",
                  color: "#fff",
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "20px",
              border: "1px solid #edf2f7",
              height: "100%",
            }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Personal Information
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                  First Name
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body1" fontWeight={600}>
                    {firstName}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                  Last Name
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body1" fontWeight={600}>
                    {lastName}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1, borderStyle: "dashed" }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                  Email Address
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body1" fontWeight={600}>
                    {user.email}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} mt={{ xs:4 , md: 0 }}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "24px",
              border: "1px solid #edf2f7",
              height: "100%",
            }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Account Status
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  MEMBER SINCE
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <CalendarMonthIcon color="primary" />
                  <Typography variant="body1" fontWeight={600}>
                    {user.created}
                  </Typography>
                </Stack>
              </Box>
              <Divider sx={{ my: 1, borderStyle: "dashed" }} />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  SECURITY LEVEL
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Your account is managed under <strong>{user.role}</strong> permissions.
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}