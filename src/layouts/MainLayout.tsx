import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  IconButton,
  Divider,
  Breadcrumbs,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import Logo from "../assets/logo.png";
import { useState, useMemo, useCallback } from "react";
import { canViewUsers, canViewReports } from "../utils/permissions";
import type { ReactNode } from "react";
const DRAWER_WIDTH = 250;
const HEADER_HEIGHT = 70;

const COLORS = {
  primary: "#1976d2",
  background: "#f5f7fb",
  surface: "#ffffff",
  text: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  hover: "#e3f2fd",
  icon: "#9e9e9e",
  shadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
} as const;

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/users", label: "Users", icon: <PeopleIcon /> },
  { path: "/reports", label: "Reports", icon: <BarChartIcon /> },
  { path: "/settings", label: "Settings", icon: <SettingsIcon /> },
];

const BREADCRUMB_MAP: Record<string, string> = {
  users: "Users",
  reports: "Reports",
  settings: "Settings",
  profile: "Profile",
};

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ item, isActive, onClick }: SidebarItemProps) => (
  <ListItemButton
    component={Link}
    to={item.path}
    onClick={onClick}
    sx={{
      borderRadius: 1.5,
      mb: 0.5,
      color: isActive ? COLORS.primary : "#555",
      bgcolor: isActive ? COLORS.hover : "transparent",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      "& .MuiListItemIcon-root": {
        color: isActive ? COLORS.primary : COLORS.icon,
        minWidth: 40,
        transition: "color 0.2s ease",
      },
      "&:hover": {
        bgcolor: COLORS.hover,
        color: COLORS.primary,
        "& .MuiListItemIcon-root": {
          color: COLORS.primary,
        },
      },
    }}>
    <ListItemIcon>{item.icon}</ListItemIcon>
    <ListItemText
      primary={item.label}
      primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}/>
  </ListItemButton>
);

interface BreadcrumbItemProps {
  label: string;
  to: string;
  isLast: boolean;
}

const BreadcrumbItem = ({ label, to, isLast }: BreadcrumbItemProps) => (
  <Link
    to={to}
    style={{
      textDecoration: "none",
      color: isLast ? COLORS.text : COLORS.textSecondary,
      fontSize: 13,
      fontWeight: isLast ? 600 : 500,
      pointerEvents: isLast ? "none" : "auto",
      cursor: isLast ? "default" : "pointer",
      transition: "color 0.2s ease",
    }}
    onMouseEnter={(e) => {
      if (!isLast) {
        e.currentTarget.style.color = COLORS.primary;
      }
    }}
    onMouseLeave={(e) => {
      if (!isLast) {
        e.currentTarget.style.color = COLORS.textSecondary;
      }
    }}>
    {label}
  </Link>
);

export default function MainLayout(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role;
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuOpen = Boolean(anchorEl);

  const pathParts = useMemo(
    () => location.pathname.split("/").filter(Boolean),
    [location.pathname]
  );
  const fullName = user?.name ?? "";
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] ?? "";

  const handleDrawerToggle = useCallback(() => {
    setMobileDrawerOpen((prev) => !prev);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setMobileDrawerOpen(false);
  }, []);

  const handleProfileClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(e.currentTarget);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const goToProfile = useCallback(() => {
    handleMenuClose();
    navigate("/Profile");
  }, [navigate, handleMenuClose]);

  const logoutUser = useCallback(() => {
  dispatch(logout());
  handleMenuClose();
  navigate("/login");
}, [dispatch, navigate, handleMenuClose]);

  const isNavActive = useCallback(
    (path: string) => {
      if (path === "/") return location.pathname === "/";
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const handleNavClick = useCallback(() => {
    if (!isLargeScreen) {
      handleDrawerClose();
    }
  }, [isLargeScreen, handleDrawerClose]);
  const visibleNavItems = useMemo(() => {
  return NAV_ITEMS.filter((item) => {
    if (item.path === "/users") {
      return canViewUsers(role);
    }

    if (item.path === "/reports") {
      return canViewReports(role);
    }

    return true;
  });
}, [role]);

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          display: { xs: "flex", md: "none" },
        }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "18px",
            color: COLORS.primary,
            letterSpacing: 0.5,
          }}>
          ElectroDash
        </Typography>
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            color: COLORS.text,
          }}>
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <Divider sx={{ display: { xs: "block", md: "none" } }} />

      <List
        sx={{
          mt: 1,
          px: 1,
          flexGrow: 1,
        }}>
        {visibleNavItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={isNavActive(item.path)}
            onClick={handleNavClick}/>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          bgcolor: COLORS.hover,
          borderRadius: 1.5,
          m: 1,
          textAlign: "center",
        }}>
        <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow:"hidden",
        bgcolor: COLORS.background,
      }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          height: HEADER_HEIGHT,
          justifyContent: "center",
          px: { xs: 0.5, sm: 1 },
          zIndex: 1300,
        }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: HEADER_HEIGHT,
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: "flex", md: "none" },
                color: COLORS.text,
                mr: 1,
              }}>
              {mobileDrawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src={Logo}
                alt="ElectroDash Logo"
                width={40}
                height={40}
                style={{ borderRadius: "8px" }}/>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "18px", sm: "22px" },
                  color: COLORS.primary,
                  letterSpacing: 0.5,
                  display: { xs: "none", sm: "block" },
                }}>
                ElectroDash
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
            <Tooltip title="Notification" placement="bottom" arrow>
            <IconButton>
              <Badge badgeContent={0} color="error">
                <NotificationsIcon sx={{ color: "#444", fontSize: 22 }} />
              </Badge>
            </IconButton>
            </Tooltip>

            <Box
              onClick={handleProfileClick}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: { xs: 0.75, sm: 1.5 },
                py: 0.75,
              }}>
              <Avatar
              sx={{
                bgcolor: COLORS.primary,
                width: 32,
                height: 32,
                fontSize: 14,
                fontWeight: 600,
                }}>
                  {firstName.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
              },
            }}>
            <MenuItem onClick={goToProfile}>
            <PersonOutlineIcon fontSize="small" />
            My Profile
            </MenuItem>
            <MenuItem onClick={logoutUser} sx={{ color: "#d32f2f" }}>
            <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Desktop Drawer (Permanent) */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: "none", md: "block" },
        }}>
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              background: COLORS.surface,
              borderRight: `1px solid ${COLORS.border}`,
              mt: `${HEADER_HEIGHT}px`,
              p: 2,
            },
          }}>
          {drawerContent}
        </Drawer>
      </Box>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            background: COLORS.surface,
            borderRight: `1px solid ${COLORS.border}`,
            mt: `${HEADER_HEIGHT}px`,
          },
        }}>
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginTop: `${HEADER_HEIGHT}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          ml: { xs: 0, md: 0 },
          p: { xs: 1.5, sm: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: COLORS.background,
          overflow:"hidden",
        }}>
        {pathParts.length > 0 && (
      <Breadcrumbs separator={<ChevronRightIcon sx={{ fontSize: 16 }} />}
      sx={{fontSize: 13,color: COLORS.textSecondary,mb: { xs: 1.5, md: 2 },px: { xs: 1, sm: 0 },}}>
        <BreadcrumbItem label="Dashboard"
        to="/"
        isLast={false}/>
        {pathParts.map((part, i) => {
          const label = BREADCRUMB_MAP[part.toLowerCase()] || part;
          const to = "/" + pathParts.slice(0, i + 1).join("/");
          const isLast = i === pathParts.length - 1;
          return (
          <BreadcrumbItem
          key={to}
          label={label}
          to={to}
          isLast={isLast}/>
        );
        })}
        </Breadcrumbs>)}
        <Box
          sx={{
            flex: 1,
            height:"100vh",
            overflowY: "auto",
            overflowX:"hidden",
            pb: 6,
                scrollbarWidth: "none",      
                "&::-webkit-scrollbar": {
                  display: "none",             
                },
          }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
