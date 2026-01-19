import { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Skeleton,
  InputAdornment, 
  IconButton,     
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; 
import FilterListIcon from "@mui/icons-material/FilterList"; 
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; 
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridReadyEvent,
  GridSizeChangedEvent,
} from "ag-grid-community";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { canDeleteUsers } from "../../utils/permissions";
import DeleteIcon from "@mui/icons-material/Delete";

const filterInputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#e0e4ec",
    },
    "&:hover fieldset": {
      borderColor: "#d0d4dc",
    },
  },
};
const menuProps = {
  PaperProps: {
    sx: {
      borderRadius: "12px",
      marginTop: "8px",
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
      '& .MuiMenuItem-root': {
        padding: "10px 16px",
        margin: "4px 8px",
        borderRadius: "8px", 
        fontSize: "0.875rem",
        fontWeight: 500,
        '&:hover': {
          backgroundColor: "#f4f0ff", 
          color: "#7b42f5",
        },
        '&.Mui-selected': {
          color: "blue",
        },
      },
    },
  },
};

export default function Users() {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const loggedInEmail = useSelector(
    (state: RootState) => state.auth.user?.email
  );

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const gridApiRef = useRef<any>(null);

  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onGridSizeChanged = (params: GridSizeChangedEvent) => {
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.append("search", debouncedSearch);
    if (roleFilter) params.append("role", roleFilter);
    if (statusFilter) params.append("status", statusFilter);

    setLoading(true);
    fetch(`/api/users?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = loggedInEmail
          ? data.filter(
              (user: User) =>
                user.email.toLowerCase() !== loggedInEmail.toLowerCase()
            )
          : data;
        setUsers(filtered);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, roleFilter, statusFilter, loggedInEmail]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const hasActiveFilters =
    search !== "" || roleFilter !== "" || statusFilter !== "";

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setSnackbarOpen(true);
  };

  const baseColumns: ColDef<User>[] = [
    { headerName: "Name", field: "name", flex: 1, minWidth: 160 },
    {
      headerName: "Email",
      field: "email",
      flex: 1.5,
      minWidth: 220,
      hide: isMobile,
    },
    { headerName: "Role", field: "role", flex: 1, minWidth: 130 },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: any) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: params.value === "Active" ? "#black" : "white",
            background: params.value === "Active" ? "#90ee90" : "#991b1b",
          }}>
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Created",
      field: "created",
      flex: 1,
      minWidth: 150,
      hide: isMobile,
    },
  ];

  const columnDefs = useMemo<ColDef<User>[]>(() => {
    if (canDeleteUsers(role)) {
      return [
        ...baseColumns,
        {
          headerName: "Actions",
          flex: 1,
          minWidth: 120,
          sortable: false,
          filter: false,
          cellRenderer: (params: any) => (
            <Tooltip title="Delete User" placement="right" arrow>
              <DeleteIcon
                sx={{
                  color: "grey",
                  cursor: "pointer",
                  fontSize: 20,
                  "&:hover": {
                    color: "black",
                  },
                }}
                onClick={() => setDeleteId(params.data.id)}
              />
            </Tooltip>
          ),
        },
      ];
    }

    return baseColumns;
  }, [role, isMobile]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
          mt: 1,
          flexWrap: "wrap",
        }}>
        <Typography variant="h5" fontWeight={600}>
          Users Table
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            width: { xs: "100%", sm: "auto" },
          }}>
          <TextField
            size="small"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ...filterInputStyle, minWidth: 240, width: { xs: "100%", sm: 260 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    sx={{
                      color: "#655a5aff",
                      width: 30,
                      height: 30,
                      mr: -0.5,
                    }}>
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            size="small"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ ...filterInputStyle, minWidth: 160, width: { xs: "100%", sm: "auto" } }}
            SelectProps={{
              IconComponent: KeyboardArrowDownIcon,
              displayEmpty: true,
              MenuProps: menuProps,
              renderValue: (selected: any) => {
                if (!selected) {
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                      <FilterListIcon sx={{ fontSize: 18 }} />
                      Filter by Role
                    </Box>
                  );
                }
                return selected;
              },
            }}>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ ...filterInputStyle, minWidth: 140, width: { xs: "100%", sm: "auto" } }}
            SelectProps={{
              IconComponent: KeyboardArrowDownIcon,
              displayEmpty: true,
              MenuProps: menuProps,
              renderValue: (selected: any) => {
                if (!selected) {
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                      <FilterListIcon sx={{ fontSize: 18 }} />
                      Status
                    </Box>
                  );
                }
                return selected;
              },
            }}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              onClick={clearFilters}
              sx={{ textTransform: "none", color: "text.secondary", fontWeight: 500 }}>
              Clear filters
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#fff",
          border: "1px solid #e5e7eb",
        }}
      >
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box className="ag-theme-quartz" sx={{ minWidth: 720 }}>
            {loading && (
              <Box p={2}>
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </Box>
            )}

            {!loading && users.length === 0 && (
              <Typography textAlign="center" color="text.secondary" mt={4}>
                No users found.
              </Typography>
            )}

            {!loading && users.length > 0 && (
              <AgGridReact
                theme="legacy"
                domLayout="autoHeight"
                rowData={users}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[5, 10, 20]}
                animateRows
                rowSelection="single"
                onGridReady={onGridReady}
                onGridSizeChanged={onGridSizeChanged}
                onCellClicked={(event) => {
                  if (event.colDef.headerName === "Actions") return;
                  if (event.data) navigate(`/users/${event.data.id}`);
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleDeleteUser(deleteId!);
              setDeleteId(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" variant="filled">
          User deleted successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}