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
// } from "@mui/material";
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

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
//     <Paper>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {columns.map((col) => (
//                 <TableCell key={col.field}>
//                   {col.sortable ? (
//                     <TableSortLabel
//                       active={orderBy === col.field}
//                       direction={orderBy === col.field ? order : "asc"}
//                       onClick={() => handleSort(col.field)}
//                     >
//                       {col.label}
//                     </TableSortLabel>
//                   ) : (
//                     col.label
//                   )}
//                 </TableCell>
//               ))}
//               {actions && <TableCell>Actions</TableCell>}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedRows.map((row, index) => (
//               <TableRow key={index}>
//                 {columns.map((col) => (
//                   <TableCell key={col.field}>
//                     {col.render ? col.render(row[col.field], row) : row[col.field]}
//                   </TableCell>
//                 ))}
//                 {actions && <TableCell>{actions(row)}</TableCell>}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         component="div"
//         count={rows.length}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         rowsPerPageOptions={rowsPerPageOptions}
//       />
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
  Box // Import Box
} from "@mui/material";
// ... other imports

function DynamicTable({ columns, rows, actions, rowsPerPageOptions = [5, 10, 25] }) {
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

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

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    // Wrap the entire component in a Box that can grow
    <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flexGrow: 1 }}> {/* The TableContainer must also grow */}
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field}>
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
                {actions && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
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