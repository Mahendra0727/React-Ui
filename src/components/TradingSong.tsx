import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Slider,
  Stack,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import axios from "axios";

const API_ENDPOINTS: Record<string, string> = {
  trending: "https://music-lib-s8zi.onrender.com/get_trending_music",
  mostplayed: "https://music-lib-s8zi.onrender.com/get_most_played_songs",
  fav: "",
};

type Song = {
  audioUrl: string | null;
  duration: number;
  playCount: number;
  thumbnail: string;
  title: string;
  videoId: string;
};

const playlists = [
  { key: "mostplayed", name: "Most Played Songs" },
  { key: "trending", name: "Trending Songs" },
  { key: "fav", name: "Favourites" },
];

const formatTime = (sec: number) => {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const MusicApp = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchSongs = (playlistKey: string) => {
    setLoading(true);
    setSongs([]);
    setCurrentSongIndex(null);
    setIsPlaying(false);
    setActivePlaylist(playlistKey);

    if (!API_ENDPOINTS[playlistKey]) {
      setLoading(false);
      return;
    }

    axios
      .get(API_ENDPOINTS[playlistKey])
      .then((res) => {
        const list =
          res.data?.most_played_music || res.data?.trending_music || [];
        setSongs(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handlePlay = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = repeat;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex, repeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);

    const handleEnded = () => {
      if (repeat) {
        audio.play();
      } else if (shuffle && songs.length > 1) {
        let next;
        do {
          next = Math.floor(Math.random() * songs.length);
        } while (next === currentSongIndex);
        setCurrentSongIndex(next);
        setIsPlaying(true);
      } else {
        if (currentSongIndex !== null && currentSongIndex < songs.length - 1) {
          setCurrentSongIndex(currentSongIndex + 1);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
          setProgress(0);
        }
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeat, shuffle, songs.length, currentSongIndex]);

  const handleNext = () => {
    if (currentSongIndex !== null && currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentSongIndex !== null && currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
      setIsPlaying(true);
    }
  };

  const duration =
    currentSongIndex !== null ? songs[currentSongIndex]?.duration : 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 20, sm: 14 } }}>
      {!activePlaylist && (
        <>
          <Typography variant="h4" gutterBottom>
            Playlists
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            mb={3}
            justifyContent={{ xs: "center", sm: "flex-start" }}
          >
            {playlists.map((pl) => (
              <Box
                key={pl.key}
                onClick={() => fetchSongs(pl.key)}
                sx={{
                  borderRadius: 3,
                  width: 160,
                  textAlign: "center",
                  p: 2,
                  cursor: "pointer",
                  bgcolor:
                    activePlaylist === pl.key
                      ? "primary.main"
                      : "background.paper",
                  color: activePlaylist === pl.key ? "white" : "text.primary",
                  boxShadow: activePlaylist === pl.key ? 4 : 1,
                  "&:hover": {
                    boxShadow: 6,
                    bgcolor:
                      activePlaylist === pl.key ? "primary.dark" : "grey.100",
                  },
                }}
                tabIndex={0}
                role="button"
                aria-pressed={activePlaylist === pl.key}
              >
                <Typography variant="h6" fontWeight={600}>
                  {pl.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {activePlaylist && (
        <>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              setActivePlaylist(null);
              setSongs([]);
              setCurrentSongIndex(null);
              setIsPlaying(false);
              setProgress(0);
            }}
            sx={{ mb: 2 }}
          >
            Back to Playlists
          </Button>

          <Typography variant="h5" mb={2}>
            {playlists.find((p) => p.key === activePlaylist)?.name}
          </Typography>
        </>
      )}

      {loading && (
        <Box mt={4} display="flex" justifyContent="center">
          Loading...
        </Box>
      )}

      {!loading && activePlaylist && songs.length > 0 && (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(auto-fill,minmax(280px,1fr))",
          }}
          gap={2}
          mb={12}
        >
          {songs.map((song, idx) => (
            <Card
              key={idx}
              onClick={() => handlePlay(idx)}
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                gap: 1,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: 3,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                bgcolor:
                  currentSongIndex === idx
                    ? "primary.light"
                    : "background.paper",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
                height: { xs: 100, sm: "auto" },
              }}
            >
              <CardMedia
                component="img"
                image={song.thumbnail}
                alt={song.title}
                sx={{
                  width: { xs: 100, sm: "100%" },
                  height: { xs: "100%", sm: 160 },
                  objectFit: "cover",
                  flexShrink: 0,
                  borderRadius: { xs: "8px 0 0 8px", sm: "8px 8px 0 0" },
                }}
              />
              <CardContent
                sx={{
                  flex: 1,
                  py: 1,
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  noWrap
                >
                  {song.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  Duration: {formatTime(song.duration)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {currentSongIndex !== null && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            px: 2,
            py: 1,
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            maxWidth: 720,
            mx: "auto",
            width: "100%",
            zIndex: 1300,
          }}
        >
          {/* Now playing info + controls */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center" flex={1}>
              <Box
                component="img"
                src={songs[currentSongIndex].thumbnail}
                alt={songs[currentSongIndex].title}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 1,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ fontWeight: 600, maxWidth: 200 }}
                title={songs[currentSongIndex].title}
              >
                {songs[currentSongIndex].title}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                aria-label="previous"
                onClick={handlePrev}
                disabled={currentSongIndex === 0}
              >
                <SkipPreviousIcon />
              </IconButton>

              <IconButton
                aria-label={isPlaying ? "pause" : "play"}
                onClick={() => setIsPlaying((v) => !v)}
                size="large"
              >
                {isPlaying ? (
                  <PauseIcon fontSize="large" />
                ) : (
                  <PlayArrowIcon fontSize="large" />
                )}
              </IconButton>

              <IconButton
                aria-label="next"
                onClick={handleNext}
                disabled={currentSongIndex === songs.length - 1}
              >
                <SkipNextIcon />
              </IconButton>

              <IconButton
                aria-label="shuffle"
                color={shuffle ? "primary" : "default"}
                onClick={() => setShuffle((v) => !v)}
              >
                <ShuffleIcon />
              </IconButton>

              <IconButton
                aria-label="repeat"
                color={repeat ? "primary" : "default"}
                onClick={() => setRepeat((v) => !v)}
              >
                <RepeatIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Progress bar and time below controls */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mt={1}
            sx={{ userSelect: "none" }}
          >
            {/* Elapsed time */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 36, textAlign: "right" }}
            >
              {formatTime(progress)}
            </Typography>

            {/* Progress bar container */}
            <Box
              sx={{
                position: "relative",
                height: 6,
                bgcolor: "grey.300",
                borderRadius: 3,
                flexGrow: 1,
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={(e) => {
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                const clickPos = e.clientX - rect.left;
                const ratio = Math.min(Math.max(clickPos / rect.width, 0), 1);
                if (audioRef.current) {
                  audioRef.current.currentTime = ratio * duration;
                  setProgress(ratio * duration);
                }
              }}
              aria-label="Audio progress bar"
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={progress}
              tabIndex={0}
              onKeyDown={(e) => {
                if (!audioRef.current) return;
                const step = 5; // 5 seconds step
                if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  audioRef.current.currentTime = Math.max(
                    audioRef.current.currentTime - step,
                    0
                  );
                  setProgress(audioRef.current.currentTime);
                  e.preventDefault();
                } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  audioRef.current.currentTime = Math.min(
                    audioRef.current.currentTime + step,
                    duration
                  );
                  setProgress(audioRef.current.currentTime);
                  e.preventDefault();
                }
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  bgcolor: "primary.main",
                  width: duration ? `${(progress / duration) * 100}%` : "0%",
                  transition: "width 0.1s linear",
                }}
              />
            </Box>

            {/* Total duration */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 36, textAlign: "left" }}
            >
              {formatTime(duration)}
            </Typography>
          </Stack>
        </Box>
      )}

      <audio
        ref={audioRef}
        src={
          currentSongIndex !== null
            ? songs[currentSongIndex]?.audioUrl || undefined
            : undefined
        }
        preload="auto"
      />
    </Box>
  );
};

export default MusicApp;
