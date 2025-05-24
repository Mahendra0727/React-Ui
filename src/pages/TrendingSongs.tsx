import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ClickAwayListener,
  Slider,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CloseIcon from "@mui/icons-material/Close";
import {
  FavoriteBorder,
  Forward10,
  Menu,
  Pause,
  PlayArrow,
  Replay10,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";

import SongDrawer from "../components/SongPlayerDrawer";

type Song = {
  audioUrl: string;
  duration: number;
  playCount: number;
  thumbnail: string;
  title: string;
  videoId: string;
};

interface Props {
  songs: Song[];
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const TrendingSongs: React.FC<Props> = ({ songs }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const handlePlayClick = (song: Song, index: number) => {
    setCurrentIndex(index);
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    setShowPanel(false);
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = typeof newValue === "number" ? newValue : newValue[0];
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedSong(null);
  };

  const handlePlayPause = () => setIsPlaying((prev) => !prev);

  const handlePrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < songs.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextSong = songs[nextIndex];

      setCurrentSong(nextSong);
      setCurrentIndex(nextIndex);
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
    if (audioRef.current && currentSong?.duration) {
      audioRef.current.currentTime = Math.min(
        currentSong.duration,
        audioRef.current.currentTime + 10
      );
      setCurrentTime(audioRef.current.currentTime); // update UI
    }
  };

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  // if (loading)
  //   return (
  //     <Box display="flex" justifyContent="center" mt={4}>
  //       <CircularProgress />
  //     </Box>
  //   );

  // if (error)
  //   return (
  //     <Box display="flex" justifyContent="center" mt={4}>
  //       <Alert severity="error">{error}</Alert>
  //     </Box>
  //   );

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      if (!currentSong.audioUrl) {
        console.warn("Missing audio URL");
        return;
      }

      audio.src = currentSong.audioUrl;

      const playAudio = async () => {
        try {
          await audio.load();
          await audio.play();
        } catch (err) {
          console.error("Play error:", err);
        }
      };

      playAudio();
    }
  }, [currentSong]);

  const handleMoreClick = (song: Song) => {
    setSelectedSong(song);
    setShowPanel(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying, currentSong]);

  const chunkedSongs: Song[][] = [];
  for (let i = 0; i < songs.length; i += 3) {
    chunkedSongs.push(songs.slice(i, i + 3));
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="h6" gutterBottom>
        Trending Played Songs
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
                <Paper
                  key={song.videoId}
                  elevation={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    mb: 1.5,
                    bgcolor: currentIndex === songIndex ? "#f0f0f0" : "#fff",
                  }}
                  onClick={() => handlePlayClick(song, songIndex)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="img"
                      src={song.thumbnail}
                      alt={song.title}
                      sx={{
                        width: 88,
                        height: 50,
                        borderRadius: 1,
                        objectFit: "cover",
                        aspectRatio: "16 / 9",
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Tooltip title={song.title}>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "180px",
                            fontWeight: 500,
                            fontSize: {
                              xs: "0.8rem", // small font on mobile (xs)
                              sm: "1rem", // medium font on tablets/small screens
                              md: "1.1rem", // bigger font on medium and up
                            },
                          }}
                        >
                          {song.title}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(song.duration)}
                      </Typography>
                    </Box>
                  </Box>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoreClick(song);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Paper>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Floating options panel */}
      {showPanel && (
        <ClickAwayListener onClickAway={handleClosePanel}>
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "#fff",
              boxShadow: 5,
              borderRadius: 2,
              zIndex: 1300,
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Options
              </Typography>
              <IconButton size="small" onClick={handleClosePanel}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <List>
              <ListItemButton
                onClick={() => {
                  if (selectedSong) handlePlayClick(selectedSong, 0);
                }}
              >
                <ListItemIcon>
                  <PlayArrowIcon />
                </ListItemIcon>
                <ListItemText primary="Play Next" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <QueueMusicIcon />
                </ListItemIcon>
                <ListItemText primary="Add to Queue" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <PlaylistAddIcon />
                </ListItemIcon>
                <ListItemText primary="Add to Playlist" />
              </ListItemButton>
            </List>
          </Box>
        </ClickAwayListener>
      )}

      {/* Bottom Audio Player */}
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
                <Typography variant="caption">
                  {formatTime(currentTime)} / {formatTime(currentSong.duration)}
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
                  max={currentSong.duration}
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
                max={currentSong.duration}
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
            src={currentSong?.audioUrl}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onPlaying={() => setIsLoading(false)}
            onEnded={handleNext}
          />

          {isLoading && (
            <Box
              sx={{
                position: "fixed",
                bottom: 120,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
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

export default TrendingSongs;
