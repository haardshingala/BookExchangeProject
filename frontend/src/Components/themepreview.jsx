import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ThemePreview = () => {
  const theme = useTheme();

  // Function to determine text color for better readability
  const getTextColor = (bgColor) => {
    if (bgColor === theme.palette.primary.main || bgColor === theme.palette.secondary.main) {
      return theme.palette.getContrastText(bgColor);
    }
    return bgColor === "#F5EFE7" ? "#5D4037" : "#F5EFE7"; // Adjust contrast manually
  };

  // Define color categories (ensuring correct values)
  const colors = [
    { name: "Primary", value: theme.palette.primary.main },
    { name: "Secondary", value: theme.palette.secondary.main },
    { name: "Background Default", value: theme.palette.background.default || "#F5EFE7" },
    { name: "Background Paper", value: theme.palette.background.paper || "#EDE0D4" },
    { name: "Text Primary", value: theme.palette.text.primary || "#5D4037" },
    { name: "Text Secondary", value: theme.palette.text.secondary || "#4B3226" },
  ];

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.main }}>
        Theme Color Preview
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
        }}
      >
        {colors.map((color, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              width: "200px",
              height: "120px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: color.value,
              color: getTextColor(color.value),
              borderRadius: "12px",
              p: 2,
            }}
          >
            <Typography variant="h6">{color.name}</Typography>
            <Typography variant="body2">{color.value}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ThemePreview;
