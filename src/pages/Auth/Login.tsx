import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { Checkbox, FormControlLabel } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
    }),

    onSubmit: async (values, { setFieldError }) => {
      try {
        const res = await fetch("/api/users");
        const users = await res.json();

        const matchedUser = users.find(
          (u: any) =>
            u.email.toLowerCase() === values.email.toLowerCase()
        );

        if (!matchedUser) {
          setFieldError("email", "User not found");
          return;
        }

        if (matchedUser.status !== "Active") {
          setFieldError("email", "User account is inactive");
          return;
        }

        dispatch(
          loginSuccess({
            name: matchedUser.name,
            email: matchedUser.email,
            created: matchedUser.created,
            rememberMe: values.rememberMe,
          })
        );

        navigate("/");
      } catch (error) {
        setFieldError("email", "Login failed. Please try again.");
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}>
      <Paper
        elevation={0}
        sx={{
          width: { xs: "90%", sm: 420 },
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}>
        <Box mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access your admin dashboard
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email address"
            name="email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password &&
              Boolean(formik.errors.password)
            }
            helperText={
              formik.touched.password &&
              formik.errors.password
            }
          />
          <FormControlLabel
          control={<Checkbox
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            name="rememberMe"/>}
            label="Remember me"/>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.2 }}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
