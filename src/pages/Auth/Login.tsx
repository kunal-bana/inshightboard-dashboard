import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const loginInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px", 
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingLeft: "12px",
    transition: "all 0.2s ease-in-out",
    "& fieldset": {
      borderColor: "#e0e4ec",
    },
    "&:hover fieldset": {
      borderColor: "#7b42f5",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7b42f5",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 10px 20px rgba(123, 66, 245, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    marginLeft: "12px",
    "&.Mui-focused": {
      color: "#7b42f5",
    },
  },
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values, { setFieldError }) => {
      try {
        const res = await fetch("/api/users");
        const users = await res.json();

        const matchedUser = users.find(
          (u: any) => u.email.toLowerCase() === values.email.toLowerCase()
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
            id: matchedUser.id,
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
        px: 2,
        background:
          "radial-gradient(circle at 10% 20%, rgba(123, 66, 245, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 40%), #f8fafc",
      }}>
      <Paper
        elevation={0}
        sx={{
          width: { xs: "100%", sm: 420 },
          p: { xs: 4, sm: 6 },
          borderRadius: "24px",
          border: "1px solid #eef2f6",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
        }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "18px",
            background: "linear-gradient(135deg, #7b42f5 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            boxShadow: "0 2px 4px rgba(123, 66, 245, 0.3)",
          }}>
          <LockIcon sx={{ color: "#fff", fontSize: 30 }} />
        </Box>

        <Typography variant="h5" fontWeight={800} color="#1e293b" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="h5" color="text.secondary" mb={4}>
          Access your dashboard
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            placeholder="admin@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ ...loginInputStyle, mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "text.disabled", ml: 1, fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ ...loginInputStyle, mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "text.disabled", ml: 1, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ mr: 1 }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  name="rememberMe"
                  sx={{
                    color: "grey",
                    "&.Mui-checked": { color: "#7b42f5" },
                  }}
                />
              }
              label="Keep me logged in"
              sx={{
                "& .MuiFormControlLabel-label": { fontSize: 14, color: "#64748b" },
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{
              py: 1.8,
              borderRadius: "50px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1rem",
              background: "linear-gradient(90deg, #7b42f5 0%, #4f46e5 100%)",
              boxShadow: "0 10px 25px rgba(123, 66, 245, 0.25)",
              "&:hover": {
                background: "linear-gradient(90deg, #6a34e0 0%, #4338ca 100%)",
                boxShadow: "0 12px 30px rgba(123, 66, 245, 0.35)",
              },
            }}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}