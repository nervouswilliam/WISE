// KpiCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function KpiCard({ title, value, color, to }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        backgroundColor: color,
        color: "#fff",
        cursor: to ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": to && {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Box mt={1}>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default KpiCard;
