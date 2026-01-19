import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const filterInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#e0e4ec" },
    "&:hover fieldset": { borderColor: "#d0d4dc" },
    "&.Mui-disabled": { backgroundColor: "#f8f9fb" },
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      borderRadius: "12px",
      marginTop: "8px",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      "& .MuiMenuItem-root": {
        padding: "10px 16px",
        margin: "4px 8px",
        borderRadius: "8px",
        "&.Mui-selected": { bgcolor: "dark grey", color: "black", "&:hover": { bgcolor: "dark grey" } },
      },
    },
  },
};

export default function Settings() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const formik = useFormik({
    initialValues: { currentPassword: "", newPassword: "" },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Minimum 8 characters")
        .matches(/[A-Z]/, "At least one uppercase letter")
        .matches(/[a-z]/, "At least one lowercase letter")
        .matches(/[0-9]/, "At least one number")
        .matches(/[@$!%*?&]/, "At least one special character")
        .required("New password is required"),
    }),
    onSubmit: () => {
      setSnackbarOpen(true);
      formik.resetForm();
    },
  });

  const fullName = user?.name ?? "";
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 1, md: 3 } }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Account Settings</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Manage your profile information and security preferences.
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <List component="nav" sx={{ "& .MuiListItemButton-root": { borderRadius: "12px", mb: 1 } }}>
              <ListItemButton selected={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
                <ListItemIcon><PersonIcon color={activeTab === "profile" ? "primary" : "inherit"} /></ListItemIcon>
                <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
              <ListItemButton selected={activeTab === "password"} onClick={() => setActiveTab("password")}>
                <ListItemIcon><LockIcon color={activeTab === "password" ? "primary" : "inherit"} /></ListItemIcon>
                <ListItemText primary="Security" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </List>
          </Box>

          <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as "profile" | "password")}
              sx={filterInputStyle}
              SelectProps={{ IconComponent: KeyboardArrowDownIcon, MenuProps: menuProps }}>
              <MenuItem value="profile">Profile Information</MenuItem>
              <MenuItem value="password">Security & Password</MenuItem>
            </TextField>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #edf2f7" }}>
            
            {activeTab === "profile" && (
              <Box>
                <Typography variant="h6" fontWeight={700} mb={1}>Profile Information</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" mb={1} ml={1}>First Name</Typography>
                    <TextField fullWidth size="small" value={firstName} disabled sx={filterInputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" mb={1} ml={1}>Last Name</Typography>
                    <TextField fullWidth size="small" value={lastName} disabled sx={filterInputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12 , sm: 6 }}>
                    <Typography variant="subtitle2" mb={1} ml={1}>Email Address</Typography>
                    <TextField fullWidth size="small" value={user?.email} disabled sx={filterInputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" mb={1} ml={1}>Account Role</Typography>
                    <TextField fullWidth size="small" value={user?.role} disabled sx={filterInputStyle} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" mb={1} ml={1}>Member Since</Typography>
                    <TextField fullWidth size="small" value={user?.created ?? ""} disabled sx={filterInputStyle} />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeTab === "password" && (
              <Box>
                <Typography variant="h6" fontWeight={700} mb={1}>Change Password</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>Update your password to keep your account secure.</Typography>
                <Divider sx={{ mb: 2 }} />

                <form onSubmit={formik.handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" mb={1} ml={1}>Current Password</Typography>
                      <TextField
                        fullWidth
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        {...formik.getFieldProps("currentPassword")}
                        error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                        helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                        sx={filterInputStyle}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" mb={1} ml={1}>New Password</Typography>
                      <TextField
                        fullWidth
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        {...formik.getFieldProps("newPassword")}
                        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                        helperText={formik.touched.newPassword && formik.errors.newPassword}
                        sx={filterInputStyle}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={!formik.isValid || !formik.dirty}
                        sx={{
                          borderRadius: "12px",
                          py: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                          bgcolor: "#7b42f5",
                          "&:hover": { bgcolor: "#6a34e0" },
                          boxShadow: "0 4px 14px 0 rgba(123, 66, 245, 0.39)",
                        }} >
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: "12px" }}>
          Password updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}