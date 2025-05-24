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

const MostPlayed: React.FC<Props> = ({ songs }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const chunkedSongs: Song[][] = [];
  for (let i = 0; i < songs.length; i += 3) {
    chunkedSongs.push(songs.slice(i, i + 3));
  }

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
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
                  // onClick={() => handleSelectSong(songIndex)}
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
    </Box>
  );
};

export default MostPlayed;
