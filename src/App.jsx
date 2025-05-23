import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";

import Home from "./components/Home";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import { useEffect, useState } from "react";
import TradingSong from "./components/TradingSong";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tredings" element={<TradingSong />} />
      </Routes>

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
        >
          <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
          <BottomNavigationAction
            label="Trading Song"
            value="/tredings"
            icon={<AudiotrackIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="/profile"
            icon={<PersonIcon />}
          />
          <BottomNavigationAction
            label="Settings"
            value="/settings"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}
