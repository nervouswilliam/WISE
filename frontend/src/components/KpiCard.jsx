// KpiCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

function KpiCard({ title, value, color, to, icon, trend, subtitle }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        color: "#fff",
        cursor: to ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": to && {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ opacity: 0.9, letterSpacing: 0.3 }}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box mt={1.5} sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
          {trend && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                backgroundColor: "rgba(255,255,255,0.22)",
                borderRadius: 1,
                px: 0.8,
                py: 0.2,
              }}
            >
              {trend.direction === "up" ? (
                <TrendingUpIcon sx={{ fontSize: 16 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16 }} />
              )}
              <Typography variant="caption" fontWeight="bold">
                {trend.label}
              </Typography>
            </Box>
          )}
        </Box>

        {subtitle && (
          <Typography variant="caption" sx={{ opacity: 0.85, display: "block", mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default KpiCard;
