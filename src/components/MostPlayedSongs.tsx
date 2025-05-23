import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Slider,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Replay10,
  Forward10,
  FavoriteBorder,
  Menu,
} from "@mui/icons-material";
import SongDrawer from "./SongPlayerDrawer";

type Song = {
  audioUrl: string;
  duration: number;
  playCount: number;
  thumbnail: string;
  title: string;
  videoId: string;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const MostPlayedSongs: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchSongs = async () => {
    try {
      const res = await fetch(
        "https://music-lib-s8zi.onrender.com/get_most_played_songs"
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSongs(data.most_played_songs || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoaded = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      isPlaying ? audio.play() : audio.pause();
    }
  }, [isPlaying, currentIndex]);

  const handlePlayPause = () => setIsPlaying((prev) => !prev);

  const handleSelectSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleRewind10 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10
      );
      setCurrentTime(audioRef.current.currentTime); // update UI
    }
  };

  const handleForward10 = () => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 10
      );
      setCurrentTime(audioRef.current.currentTime); // update UI
    }
  };

  const handleSeek = (_event: Event, newValue: number | number[]) => {
    if (audioRef.current && typeof newValue === "number") {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const chunkedSongs: Song[][] = [];
  for (let i = 0; i < songs.length; i += 3) {
    chunkedSongs.push(songs.slice(i, i + 3));
  }

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;

  return (
    <Box>
      <Typography variant="h6" fontSize={14} mt={1}>
        Most Played Songs
      </Typography>

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {chunkedSongs.map((group, idx) => (
          <Box
            key={idx}
            sx={{ scrollSnapAlign: "start", flex: "0 0 100%", p: 1 }}
          >
            {group.map((song, index) => {
              const songIndex = idx * 3 + index;
              return (
                <Box
                  key={song.videoId}
                  onClick={() => handleSelectSong(songIndex)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    bgcolor:
                      currentIndex === songIndex ? "#f0f0f0" : "transparent",
                  }}
                >
                  <Box
                    component="img"
                    src={song.thumbnail}
                    alt={song.title}
                    sx={{ width: 40, height: 40, borderRadius: 1 }}
                  />
                  <Box>
                    <Typography variant="body2" noWrap>
                      {song.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(song.duration)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {currentSong && <Box height={80} />}

      {!drawerOpen && currentSong && (
        <Box
          sx={{
            position: "fixed",
            bottom: 56,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid #ccc",
            py: 1,
            px: 2,
            zIndex: 1300,
          }}
        >
          <Box
            sx={{
              maxWidth: 800,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "space-between" : "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flex: isMobile ? "1 1 auto" : "unset",
                minWidth: 0,
              }}
            >
              <Box
                component="img"
                src={currentSong.thumbnail}
                alt={currentSong.title}
                sx={{ width: 40, height: 40, borderRadius: 1, flexShrink: 0 }}
              />
              <Box
                sx={{
                  overflow: "hidden",
                  minWidth: 0,
                }}
              >
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    maxWidth: isMobile ? "70vw" : "30vw",
                  }}
                >
                  {currentSong.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "nowrap",
              }}
            >
              {isMobile && (
                <IconButton>
                  <FavoriteBorder />
                </IconButton>
              )}
              <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                <SkipPrevious />
              </IconButton>

              {!isMobile && (
                <>
                  <IconButton onClick={handleRewind10}>
                    <Replay10 />
                  </IconButton>
                </>
              )}

              <IconButton onClick={handlePlayPause}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>

              {!isMobile && (
                <>
                  <IconButton onClick={handleForward10}>
                    <Forward10 />
                  </IconButton>
                </>
              )}

              <IconButton
                onClick={handleNext}
                disabled={currentIndex === songs.length - 1}
              >
                <SkipNext />
              </IconButton>
              {!isMobile && (
                <IconButton>
                  <FavoriteBorder />
                </IconButton>
              )}
              <IconButton onClick={toggleDrawer}>
                <Menu />
              </IconButton>
            </Box>
            {isMobile && (
              <Box sx={{ width: "100%", mt: -3 }}>
                <Slider
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-labelledby="audio-progress-slider"
                  sx={{
                    height: 6,
                    "& .MuiSlider-rail": {
                      height: 4,
                      borderRadius: 2,
                    },
                    "& .MuiSlider-track": {
                      height: 4,
                      borderRadius: 2,
                    },
                    "& .MuiSlider-thumb": {
                      display: "none",
                    },
                  }}
                />
              </Box>
            )}
          </Box>
          {!isMobile && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <Slider
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                aria-labelledby="audio-progress-slider"
                sx={{
                  height: 6,
                  "& .MuiSlider-rail": {
                    height: 4,
                    borderRadius: 2,
                  },
                  "& .MuiSlider-track": {
                    height: 4,
                    borderRadius: 2,
                  },
                  "& .MuiSlider-thumb": {
                    display: "none",
                  },
                }}
              />
            </Box>
          )}

          <audio
            ref={audioRef}
            src={currentSong.audioUrl}
            onEnded={handleNext}
          />
        </Box>
      )}
      {currentSong && (
        <SongDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          song={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      )}
    </Box>
  );
};

export default MostPlayedSongs;
