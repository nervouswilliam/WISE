import {Box} from "@mui/material";

export default function StatusPill({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bg: "#fff7e6", color: "#b26a00" }; // yellow
      case "Done":
        return { bg: "#e6ffed", color: "#1b5e20" }; // green
      case "Cancelled":
        return { bg: "#ffebee", color: "#b71c1c" }; // red
      default:
        return { bg: "#f5f5f5", color: "#424242" };
    }
  };

  const { bg, color } = getStatusColor(status);

  return (
    <Box
      sx={{
        backgroundColor: bg,
        color,
        px: 1.5,
        py: 0.5,
        borderRadius: "12px",
        fontWeight: 500,
        display: "inline-block",
      }}
    >
      {status}
    </Box>
  );
}
