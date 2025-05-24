import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

type Song = {
  videoId: string;
  title: string;
  thumbnail: string;
};

type Props = {
  songs: Song[];
};

const RecentlyPlayed: React.FC<Props> = ({ songs }) => {
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Recently Played
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          pb: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {songs.slice(0, 3).map((song) => (
          <Card
            key={song.videoId}
            sx={{
              minWidth: 200,
              borderRadius: 2,
              boxShadow: 3,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={song.thumbnail}
              alt={song.title}
              sx={{ borderRadius: "12px 12px 0 0" }}
            />
            <CardContent>
              <Typography variant="subtitle1" noWrap fontWeight={600}>
                {song.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default RecentlyPlayed;
