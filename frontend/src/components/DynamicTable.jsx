// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableSortLabel,
//   Paper,
//   TablePagination,
//   Button,
//   Box // Import Box
// } from "@mui/material";
// // ... other imports

// function DynamicTable({ columns, rows, actions, rowsPerPageOptions = [5, 10, 25] }) {
//   const [orderBy, setOrderBy] = useState("");
//   const [order, setOrder] = useState("asc");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

//   const handleSort = (field) => {
//     const isAsc = orderBy === field && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(field);
//   };

//   const sortedRows = [...rows].sort((a, b) => {
//     if (!orderBy) return 0; // no sorting
//     if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
//     if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
//     return 0;
//   });

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     // Wrap the entire component in a Box that can grow
//     <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         <TableContainer sx={{ flexGrow: 1 }}> {/* The TableContainer must also grow */}
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {columns.map((col) => (
//                   <TableCell key={col.field}>
//                     {col.sortable ? (
//                       <TableSortLabel
//                         active={orderBy === col.field}
//                         direction={orderBy === col.field ? order : "asc"}
//                         onClick={() => handleSort(col.field)}
//                       >
//                         {col.label}
//                       </TableSortLabel>
//                     ) : (
//                       col.label
//                     )}
//                   </TableCell>
//                 ))}
//                 {actions && <TableCell>Actions</TableCell>}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedRows.map((row, index) => (
//                 <TableRow key={index}>
//                   {columns.map((col) => (
//                     <TableCell key={col.field}>
//                       {col.render ? col.render(row[col.field], row) : row[col.field]}
//                     </TableCell>
//                   ))}
//                   {actions && <TableCell>{actions(row)}</TableCell>}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           component="div"
//           count={rows.length}
//           page={page}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           rowsPerPageOptions={rowsPerPageOptions}
//         />
//     </Paper>
//   );
// }

// export default DynamicTable;

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
  Button,
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
    if (!orderBy) return 0; // no sorting
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 📱 Mobile view: show card layout
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
                <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  {col.label}
                </Typography>
                <Typography variant="body2">
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
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

  // 🖥️ Desktop view: standard table
  return (
    <Paper
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          flexGrow: 1,
          overflowX: "auto", // Enables horizontal scroll on smaller laptops
        }}
      >
        <Table size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
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
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow hover key={index}>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                  >
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
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
