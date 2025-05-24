import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Slider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Replay10,
  Forward10,
  FavoriteBorder,
  Loop,
} from "@mui/icons-material";

type Song = {
  audioUrl: string;
  duration: number;
  playCount: number;
  thumbnail: string;
  title: string;
  videoId: string;
};

type SongDrawerProps = {
  open: boolean;
  onClose: () => void;
  song: Song;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  onPrev?: () => void; // 👈 Add these two for parent control
  onNext?: () => void;
};

const formatTime = (time: number) =>
  `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(time % 60)
    .toString()
    .padStart(2, "0")}`;

const SongDrawer: React.FC<SongDrawerProps> = ({
  open,
  onClose,
  song,
  isPlaying,
  setIsPlaying,
  onPrev,
  onNext,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loop, setLoop] = useState(false);
  const [duration, setDuration] = useState(song.duration || 0);

  // Handle playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = loop;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, loop]);

  // Track time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || song.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [song]);

  const handleSeek = (_: Event, value: number | number[]) => {
    const time = typeof value === "number" ? value : value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePlayPause = () => setIsPlaying((prev) => !prev);

  const handleRewind10 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const handleForward10 = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        duration
      );
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: open ? 0 : "-100%",
        left: 0,
        right: 0,
        height: "100vh",
        bgcolor: "background.paper",
        zIndex: 1500,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        transition: "bottom 0.4s ease-in-out",
        display: "flex",
        flexDirection: "column",
        p: 2,
        overflowY: "auto",
      }}
    >
      <audio ref={audioRef} src={song.audioUrl} preload="metadata" />

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
          {song.title}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Thumbnail */}
      <Box
        component="img"
        src={song.thumbnail}
        alt={song.title}
        sx={{
          width: "100%",
          height: isMobile ? "35vh" : "45vh",
          objectFit: "cover",
          borderRadius: 3,
          mb: 3,
          boxShadow: 3,
        }}
      />

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <IconButton onClick={onPrev}>
          <SkipPrevious />
        </IconButton>
        <IconButton onClick={handleRewind10}>
          <Replay10 />
        </IconButton>
        <IconButton
          onClick={handlePlayPause}
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.main",
            color: "#fff",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {isPlaying ? (
            <Pause fontSize="large" />
          ) : (
            <PlayArrow fontSize="large" />
          )}
        </IconButton>
        <IconButton onClick={handleForward10}>
          <Forward10 />
        </IconButton>
        <IconButton onClick={onNext}>
          <SkipNext />
        </IconButton>
        <IconButton
          onClick={() => setLoop((prev) => !prev)}
          color={loop ? "primary" : "default"}
        >
          <Loop />
        </IconButton>
      </Box>

      {/* Seek Bar */}
      <Box sx={{ px: 1 }}>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 0.5,
            fontSize: 12,
            color: "text.secondary",
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </Box>
      </Box>
    </Box>
  );
};

export default SongDrawer;
