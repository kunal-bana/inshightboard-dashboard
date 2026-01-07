import { AgGridReact } from "ag-grid-react";
import { Box, Card, Typography } from "@mui/material";
import type { ColDef } from "ag-grid-community";

interface HistoryRow {
  action: string;
  date: string;
  ip: string;
}

const columnDefs: ColDef[] = [
  { headerName: "Action", field: "action", flex: 1 },
  { headerName: "Date", field: "date", width: 140 },
  { headerName: "IP Address", field: "ip", width: 160 },
];

export default function UserHistoryTable({
  rows,
}: {
  rows: HistoryRow[];
}) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography fontWeight={600} mb={2}>
        Activity History
      </Typography>

      <Box className="ag-theme-quartz" sx={{ width: "100%" }}>
        <AgGridReact
          theme="legacy"
          domLayout="autoHeight"
          rowData={rows}
          columnDefs={columnDefs}
        />
      </Box>
    </Card>
  );
}
