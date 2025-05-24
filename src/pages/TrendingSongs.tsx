import React, { useState } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

  const chunkedSongs: Song[][] = [];
  for (let i = 0; i < songs.length; i += 3) {
    chunkedSongs.push(songs.slice(i, i + 3));
  }

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Treding Played Songs
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
                      sx={{ width: 50, height: 50, borderRadius: 1 }}
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

                  {/* Right section: More icon */}
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Paper>
              );
            })}
          </Box>
        ))}
      </Box>

      {currentSong && <Box height={80} />}
    </Box>
  );
};

export default TrendingSongs;
