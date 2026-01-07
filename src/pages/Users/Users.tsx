import { useEffect, useState } from "react";
import { Box, Typography,TextField,MenuItem,Button, Tooltip } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import type { User } from "../../types/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { canDeleteUsers } from "../../utils/permissions";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
            user.email.toLowerCase() !==
            loggedInEmail.toLowerCase()
        )
      : data;
    setUsers(filtered);
  })
  .finally(() => setLoading(false));
}, [debouncedSearch, roleFilter, statusFilter]);

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
  setUsers((prev) =>
    prev.filter((user) => user.id !== id)
  );
  setSnackbarOpen(true);
};

const baseColumns: ColDef<User>[] = [
  { headerName: "Name", field: "name", flex: 1 },
  {
    headerName: "Email",
    field: "email",
    flex: 1.5,
    hide: isMobile,
  },
  {
    headerName: "Role",
    field: "role",
    flex: 1,
  },
  {
    headerName: "Status",
    field: "status",
    flex: 1,
    cellRenderer: (params: any) => (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          color: params.value === "Active" ? "#166534" : "#991b1b",
          background:
            params.value === "Active" ? "#dcfce7" : "#fee2e2",
        }}>
        {params.value}
      </span>
    ),
  },
  {
    headerName: "Created",
    field: "created",
    flex: 1,
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
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => (
          <Tooltip title="Delete User" placement="right">
            <DeleteIcon
              sx={{
                color: "grey",
                cursor: "pointer",
                fontSize: 22,
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
}, [role, baseColumns]);

const defaultColDef = useMemo(() => ({
  sortable: true,
  filter: true,
  resizable: true,
}), []);

  return (
    <Box>
    <Box
    sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    mb: 2,
    mt: 1,
    flexWrap: "wrap",
  }}>

  <Typography variant="h6" fontWeight={500}>
    Users Table
  </Typography>

  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      flexWrap: "wrap",
    }}>
    <TextField
      size="small"
      label="Search"
      placeholder="Name or email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{ minWidth: 200 }}/>
    <TextField
      select
      size="small"
      label="Role"
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
      sx={{ minWidth: 130 }}>
      <MenuItem value="">All</MenuItem>
      <MenuItem value="Admin">Admin</MenuItem>
      <MenuItem value="Manager">Manager</MenuItem>
      <MenuItem value="User">User</MenuItem>
    </TextField>

    <TextField
      select
      size="small"
      label="Status"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      sx={{ minWidth: 130 }}>
      <MenuItem value="">All</MenuItem>
      <MenuItem value="Active">Active</MenuItem>
      <MenuItem value="Inactive">Inactive</MenuItem>
    </TextField>

    <Button
      variant="outlined"
      size="small"
      onClick={clearFilters}
      disabled={!hasActiveFilters}
      sx={{ height: 36 }}>
      Clear
    </Button>
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
      className="ag-theme-quartz">
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
        onCellClicked={(event) => {
          if (event.colDef.headerName === "Actions") return;
          if (event.data) navigate(`/users/${event.data.id}`);
          }}/>
          )}
        </Box>
        <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
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

      {/* Snackbar */}
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
