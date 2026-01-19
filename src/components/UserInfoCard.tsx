import {
  Card,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

interface Props {
  user: {
    name: string;
    email: string;
    role: string;
    status: string;
    created: string;
  };
}

export default function UserInfoCard({ user }: Props) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const isActive = user.status === "Active";
  return (
    <Card
      sx={{
        p: 2, 
        height: "100%",
      }}>
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
          borderBottom: "1px solid #e2e7edff",
          borderRadius:"10px"
        }}>
        <Box display="flex" alignItems="center" gap={2} mb={2.5}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              fontSize: 24,
              fontWeight: 700,
              bgcolor: "#7b42f5",
              color: "#fff",
            }}>
            {initials}
          </Avatar>

          <Box minWidth={0}>
            <Typography fontWeight={800} fontSize={20} color="#1e293b" noWrap>
              {user.name}
            </Typography>
            <Stack direction="row" spacing={1} mt={0.5}>
              <Chip
                label={user.role}
                size="medium"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  bgcolor: "rgba(123, 66, 245, 0.1)",
                  color: "#7b42f5",
                  borderRadius: "6px",
                }}
              />
              <Chip
                label={user.status}
                size="medium"
                sx={{ fontWeight: 700, fontSize: "0.65rem", borderRadius: "6px",bgcolor: isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: isActive ? "#069263ff" : "#f12b2bff",  }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "1px", mb: 2, display: "block" }}>
          Contact Information
        </Typography>

        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f1f5f9",
                color: "#64748b",
              }}
            >
              <EmailIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box minWidth={0}>
              <Typography variant="caption" color="text.secondary" display="block">
                Email Address
              </Typography>
              <Typography variant="body2" fontWeight={600} noWrap>
                {user.email}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f1f5f9",
                color: "#64748b",
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Joined Date
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {user.created}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f1f5f9",
                color: "#64748b",
              }}
            >
              <VerifiedUserIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Verification
              </Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">
                Identity Verified
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}