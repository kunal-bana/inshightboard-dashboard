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
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Settings() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /* ---------------- CHANGE PASSWORD FORM ---------------- */
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Minimum 8 characters")
        .matches(/[A-Z]/, "At least one uppercase letter")
        .matches(/[a-z]/, "At least one lowercase letter")
        .matches(/[0-9]/, "At least one number")
        .matches(/[@$!%*?&]/, "At least one special character")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm your password"),
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
    <Box maxWidth={900}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Settings
      </Typography>

      {/* 🔽 SETTINGS DROPDOWN */}
      <Box mb={3} width={220}>
        <TextField
          select
          fullWidth
          size="small"
          value={activeTab}
          onChange={(e) =>
            setActiveTab(e.target.value as "profile" | "password")
          }
        >
          <MenuItem value="profile">Profile</MenuItem>
          <MenuItem value="password">Change Password</MenuItem>
        </TextField>
      </Box>

      {/* ================= PROFILE CARD ================= */}
      {activeTab === "profile" && (
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Profile Information
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="First Name"
                fullWidth
                value={firstName}
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email"
                fullWidth
                value={user?.email}
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Role"
                fullWidth
                value={user?.role}
                disabled
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Created On"
                fullWidth
                value={user?.created ?? ""}
                disabled
              />
            </Grid>
          </Grid>
        </Card>
      )}

      {/* ================= CHANGE PASSWORD CARD ================= */}
      {activeTab === "password" && (
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Change Password
          </Typography>

          <form onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  {...formik.getFieldProps("currentPassword")}
                  error={
                    formik.touched.currentPassword &&
                    Boolean(formik.errors.currentPassword)
                  }
                  helperText={
                    formik.touched.currentPassword &&
                    formik.errors.currentPassword
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  {...formik.getFieldProps("newPassword")}
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword &&
                    formik.errors.newPassword
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  {...formik.getFieldProps("confirmPassword")}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!formik.isValid || !formik.dirty}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      )}

      {/* SUCCESS TOAST */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" variant="filled">
          Password updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
