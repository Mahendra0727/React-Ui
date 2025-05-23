import React, { useContext } from "react";
import { ColorModeContext } from "./ThemeContext";
import { Box, Typography, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";

const Setting = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Theme Settings
      </Typography>
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
      <Typography variant="body2">
        Current Theme:{" "}
        {theme.palette.mode.charAt(0).toUpperCase() +
          theme.palette.mode.slice(1)}
      </Typography>
    </Box>
  );
};

export default Setting;
