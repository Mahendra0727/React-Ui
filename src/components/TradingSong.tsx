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

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
       Treding Played Songs
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {songs.map((song, index) => (
          <Paper
            key={song.videoId}
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              borderRadius: 2,
              bgcolor: currentIndex === index ? "#f0f0f0" : "background.paper",
              transition: "0.3s",
            }}
          >
            <Box
              component="img"
              src={song.thumbnail}
              alt={song.title}
              sx={{ width: 50, height: 50, borderRadius: 1, mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" fontWeight={500} noWrap>
                {song.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(song.duration)}
              </Typography>
            </Box>
            <IconButton edge="end">
              <MoreVertIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default TrendingSongs;
