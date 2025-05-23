import {
  Box,
  Typography,
  InputBase,
  Paper,
  IconButton,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Home = () => {
  const theme = useTheme();
  const hiColor = theme.palette.primary.main;

  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentSongTitle, setCurrentSongTitle] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [mostPlayed, setMostPlayed] = useState<any[]>([]);

  // Load mostPlayed from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mostPlayed");
    if (stored) {
      setMostPlayed(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage when mostPlayed updates
  useEffect(() => {
    localStorage.setItem("mostPlayed", JSON.stringify(mostPlayed));
  }, [mostPlayed]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setSongs([]);
    setAudioUrl(null);
    setCurrentSongTitle(null);
    setShowAllResults(false);

    try {
      const res = await axios.get(
        `https://music-lib-s8zi.onrender.com/search_music?query=${encodeURIComponent(
          query.trim()
        )}`
      );

      setSongs(res.data?.search_results || []);
    } catch (err) {
      console.error("Search failed:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSongClick = async (videoId: string, title: string) => {
    setAudioLoading(true);
    setAudioUrl(null);
    setCurrentSongTitle(null);
    setCurrentVideoId(null);

    try {
      const res = await axios.get(
        `https://music-lib-s8zi.onrender.com/get_audio?videoId=${videoId}`
      );

      const url = res.data.audioUrl;

      console.log(res.data, "url", url);
      if (url) {
        setAudioUrl(url);
        setCurrentSongTitle(title);
        setCurrentVideoId(videoId);
      } else {
        console.error("No audio URL found in response");
      }
    } catch (err) {
      console.error("Failed to fetch audio URL:", err);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !currentVideoId) return;

    const progress = (audio.currentTime / audio.duration) * 100;
    if (progress >= 75) {
      const alreadyAdded = mostPlayed.some(
        (song) => song.videoId === currentVideoId
      );

      if (!alreadyAdded) {
        const playingSong =
          songs.find((s) => s.videoId === currentVideoId) ||
          mostPlayed.find((s) => s.videoId === currentVideoId);

        if (playingSong) {
          const updatedList = [
            playingSong,
            ...mostPlayed.filter((s) => s.videoId !== currentVideoId),
          ];
          setMostPlayed(updatedList.slice(0, 10)); // max 10 items
        }
      }
    }
  };

  // Auto-play audio when audioUrl changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Automatic playback started
          })
          .catch((error) => {
            console.error("Audio play error:", error);
          });
      }
    }
  }, [audioUrl]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "#f5f5f5",
        color: theme.palette.text.primary,
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Box mb={2} textAlign="center">
          <Typography variant="h5" sx={{ color: hiColor, fontWeight: 600 }}>
            Hi There,
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>
            Mahendra Jaiswal
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: "12px",
            p: "2px 8px",
            boxShadow: 5,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Songs, albums or artists"
            inputProps={{ "aria-label": "search" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IconButton
            type="submit"
            sx={{ p: "10px", color: hiColor }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* Most Played */}
        <Box mt={4}>
          <Typography variant="h6" mb={2}>
            Most Played
          </Typography>

          {mostPlayed.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              No most played songs yet. Play a song to see here.
            </Typography>
          ) : (
            mostPlayed.map((song, index) => (
              <Card
                key={`most-${index}`}
                sx={{
                  display: "flex",
                  mb: 2,
                  cursor: "pointer",
                  borderRadius: 2,
                  boxShadow: 2,
                }}
                onClick={() => handleSongClick(song.videoId, song.title)}
              >
                <CardMedia
                  component="img"
                  image={song.thumbnail}
                  alt={song.title}
                  sx={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {song.title}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Search Results */}
        <Box mt={4}>
          {loading ? (
            <Typography textAlign="center" mt={4}>
              Loading...
            </Typography>
          ) : songs.length > 0 ? (
            <>
              {(showAllResults ? songs : songs.slice(0, 3)).map(
                (song, index) => (
                  <Card
                    key={index}
                    sx={{
                      display: "flex",
                      mb: 2,
                      cursor: "pointer",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                    onClick={() => handleSongClick(song.videoId, song.title)}
                  >
                    <CardMedia
                      component="img"
                      image={song.thumbnail}
                      alt={song.title}
                      sx={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {song.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {Math.floor(song.duration / 60)}:
                        {String(song.duration % 60).padStart(2, "0")}
                      </Typography>
                    </CardContent>
                  </Card>
                )
              )}

              {!showAllResults && songs.length > 3 && (
                <Box textAlign="center" mt={1} mb={3}>
                  <Typography
                    sx={{ cursor: "pointer", color: hiColor, fontWeight: 600 }}
                    onClick={() => setShowAllResults(true)}
                  >
                    See All
                  </Typography>
                </Box>
              )}
            </>
          ) : searched ? (
            <Typography mt={3} textAlign="center" color="text.secondary">
              No songs found for "{query}".
            </Typography>
          ) : null}
        </Box>

        {/* Audio Player */}
        <Box mt={4} textAlign="center">
          {audioLoading && <Typography>Loading audio...</Typography>}
          {audioUrl && (
            <>
              <Typography variant="h6" mb={1}>
                Now Playing: {currentSongTitle}
              </Typography>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
