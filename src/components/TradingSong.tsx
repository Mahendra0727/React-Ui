import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

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

  // NEW: Fetch actual audio URL for the selected song and play it
  const handlePlay = async (index: number) => {
    setAudioError(null);
    setLoadingAudio(true);
    try {
      const videoId = songs[index].videoId;
      const res = await axios.get(
        `https://music-lib-s8zi.onrender.com/get_audio?videoId=${videoId}`
      );
      const audioUrl = res.data?.audioUrl;
      if (!audioUrl) throw new Error("Audio URL not found");

      // Update the song audioUrl in state so <audio> plays correct URL
      setSongs((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], audioUrl };
        return updated;
      });

      setCurrentSongIndex(index);
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to load audio", error);
      setAudioError("Failed to load audio. Please try again.");
      setIsPlaying(false);
    } finally {
      setLoadingAudio(false);
    }
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
              setAudioError(null);
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

      {audioError && (
        <Box mt={2} color="error.main" textAlign="center">
          {audioError}
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
                cursor: loadingAudio ? "wait" : "pointer",
                boxShadow: 3,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                bgcolor:
                  currentSongIndex === idx
                    ? "primary.light"
                    : "background.paper",
              }}
              aria-current={currentSongIndex === idx ? "true" : undefined}
              tabIndex={0}
              role="button"
            >
              <CardMedia
                component="img"
                image={song.thumbnail}
                alt={song.title}
                sx={{
                  width: { xs: 120, sm: "100%" },
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
              <CardContent
                sx={{
                  flex: "1 1 auto",
                  px: 1.5,
                  py: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  noWrap
                  title={song.title}
                >
                  {song.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Duration: {formatTime(song.duration)}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Plays: {song.playCount}
                </Typography>
                {loadingAudio && currentSongIndex === idx && (
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    Loading audio...
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Audio Player Controls */}
      {currentSongIndex !== null && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            bgcolor: "background.paper",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
            py: 1,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            zIndex: 1500,
          }}
          aria-label="Audio player controls"
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            noWrap
            title={songs[currentSongIndex].title}
          >
            {songs[currentSongIndex].title}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <IconButton
              aria-label="Previous"
              onClick={handlePrev}
              disabled={currentSongIndex === 0}
            >
              <SkipPreviousIcon />
            </IconButton>

            <IconButton
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            <IconButton
              aria-label="Next"
              onClick={handleNext}
              disabled={currentSongIndex === songs.length - 1}
            >
              <SkipNextIcon />
            </IconButton>

            <IconButton
              aria-label="Shuffle"
              color={shuffle ? "primary" : "default"}
              onClick={() => setShuffle(!shuffle)}
            >
              <ShuffleIcon />
            </IconButton>

            <IconButton
              aria-label="Repeat"
              color={repeat ? "primary" : "default"}
              onClick={() => setRepeat(!repeat)}
            >
              <RepeatIcon />
            </IconButton>
          </Stack>

          <Box
            sx={{
              width: "100%",
              height: 6,
              bgcolor: "grey.300",
              borderRadius: 1,
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={(e) => {
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
              setProgress(newTime);
            }}
            aria-label="Audio progress bar"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={progress}
          >
            <Box
              sx={{
                height: "100%",
                width: `${(progress / duration) * 100}%`,
                bgcolor: "primary.main",
                transition: "width 0.2s linear",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
            }}
            aria-live="polite"
          >
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </Box>
        </Box>
      )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={
          currentSongIndex !== null
            ? songs[currentSongIndex]?.audioUrl || ""
            : ""
        }
      />
    </Box>
  );
};

export default MusicApp;
