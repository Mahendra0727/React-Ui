import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  InputBase,
  IconButton,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

import MostPlayed from "../pages/MostPlayed";
import TrendingSongs from "../pages/TrendingSongs"
// import RecentlyPlayed from "../components/RecentlyPlayed";

const Home = () => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mostPlayed, setMostPlayed] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMostPlayed = async () => {
      try {
        const res = await axios.get(
          "https://music-lib-s8zi.onrender.com/get_most_played_songs"
        );
        setMostPlayed(res.data?.most_played_songs || []);
      } catch (err) {
        console.error("Failed to fetch most played songs:", err);
      }
    };

    fetchMostPlayed();
  }, []);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        const res = await axios.get(
          "https://music-lib-s8zi.onrender.com/get_trending_music"
        );
        setTrending(res.data?.trending_music || []);
      } catch (err) {
        console.error("Failed to fetch most played songs:", err);
      }
    };

    fetchTrendingSongs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://music-lib-s8zi.onrender.com/search_music?query=${encodeURIComponent(
          query.trim()
        )}`
      );
      setSearchResults(res.data?.search_results || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        p: 3,
      }}
    >
      {/* Search Bar */}
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          position: "sticky",
          top: 16,
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          borderRadius: "12px",
          p: "2px 8px",
          boxShadow: 4,
          mb: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <InputBase
          placeholder="Search songs, albums or artists"
          inputProps={{ "aria-label": "search" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />
        <IconButton
          type="submit"
          sx={{ p: "10px", color: primaryColor }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* MostPlayed section centered like search bar */}
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          mt: 2,
        }}
      >
        <MostPlayed songs={mostPlayed} />
      </Box>
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          mt: 2,
        }}
      >
        <TrendingSongs songs={trending} />
      </Box>
    </Box>
  );
};

export default Home;
