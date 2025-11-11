import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function DynamicTable({ columns, rows, actions, rowsPerPageOptions = [5, 10, 25] }) {
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!orderBy) return 0;
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Helper to truncate long values (like UUIDs)
  const truncate = (text, length = 12) => {
    if (typeof text !== "string") return text;
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  // 📱 Mobile view: card layout
  if (isMobile) {
    return (
      <Box>
        {paginatedRows.map((row, index) => (
          <Paper
            key={index}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            {columns.map((col) => (
              <Box
                key={col.field}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  {col.label}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                  {col.render
                    ? col.render(row[col.field], row)
                    : truncate(row[col.field])}
                </Typography>
              </Box>
            ))}
            {actions && (
              <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
                {actions(row)}
              </Box>
            )}
          </Paper>
        ))}

        {/* Pagination */}
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: "0.8rem",
            },
          }}
        />
      </Box>
    );
  }

  // 🖥️ Desktop view: sticky column + sticky header
  return (
    <Paper
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TableContainer sx={{ flexGrow: 1, overflowX: "auto" }}>
        <Table stickyHeader sx={{ tableLayout: "fixed", minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={col.field}
                  sx={{
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    backgroundColor: theme.palette.background.paper,
                    ...(idx === 0 && {
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                    }),
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : "asc"}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow hover key={index}>
                {columns.map((col, idx) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      ...(idx === 0 && {
                        position: "sticky",
                        left: 0,
                        backgroundColor: theme.palette.background.paper,
                        zIndex: 1,
                      }),
                    }}
                  >
                    {col.render
                      ? col.render(row[col.field], row)
                      : truncate(row[col.field])}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Paper>
  );
}

export default DynamicTable;
