import React, { useState } from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";

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
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleMoreClick = (song: Song) => {
    setSelectedSong(song);
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedSong(null);
  };

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
                >
                  {/* Left section: thumbnail + title + duration */}
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

                  {/* Right section: More icon */}
                  <IconButton onClick={() => handleMoreClick(song)}>
                    <MoreVertIcon />
                  </IconButton>
                </Paper>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Small floating panel */}
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
            {/* Header with close icon */}
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
              <ListItemButton>
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
    </Box>
  );
};

export default TrendingSongs;
