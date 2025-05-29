import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Paper,
  useTheme,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ColorModeContext } from "./ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SunnyIcon from "@mui/icons-material/Sunny";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import WifiIcon from "@mui/icons-material/Wifi";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TranslateIcon from "@mui/icons-material/Translate";

const Setting = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  const settingRow = (
    icon: React.ReactNode,
    label: string,
    control: React.ReactNode
  ) => (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography>{label}</Typography>
      </Box>
      {control}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          width: 400,
          maxWidth: "90%",
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" gutterBottom>
          App Settings
        </Typography>

        {/* Theme */}
        {settingRow(
          theme.palette.mode === "dark" ? (
            <DarkModeIcon sx={{ color: "#fdd835" }} />
          ) : (
            <SunnyIcon sx={{ color: "#f57f17" }} />
          ),
          "Dark Mode",
          <Switch
            checked={theme.palette.mode === "dark"}
            onChange={colorMode.toggleColorMode}
            color="primary"
          />
        )}

        {/* Bluetooth */}
        {settingRow(
          <BluetoothIcon sx={{ color: "#2962ff" }} />,
          "Bluetooth",
          <Switch
            checked={bluetoothEnabled}
            onChange={() => setBluetoothEnabled(!bluetoothEnabled)}
            color="info"
          />
        )}

        {/* WiFi */}
        {settingRow(
          <WifiIcon sx={{ color: "#00c853" }} />,
          "Wi-Fi",
          <Switch
            checked={wifiEnabled}
            onChange={() => setWifiEnabled(!wifiEnabled)}
            color="success"
          />
        )}

        {/* Sound */}
        {settingRow(
          <VolumeUpIcon sx={{ color: "#ff5722" }} />,
          "Sound",
          <Switch
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            color="warning"
          />
        )}

        {/* Notifications */}
        {settingRow(
          <NotificationsActiveIcon sx={{ color: "#d500f9" }} />,
          "Notifications",
          <Switch
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            color="secondary"
          />
        )}

        {/* Language Selector */}
        {settingRow(
          <TranslateIcon sx={{ color: "#0091ea" }} />,
          "Language",
          <Select
            value={language}
            onChange={(e: SelectChangeEvent) => setLanguage(e.target.value)}
            size="small"
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
          </Select>
        )}
      </Paper>
    </Box>
  );
};

export default Setting;
