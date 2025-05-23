// SongCard.tsx
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

const SongCard = ({ song, onClick }: { song: any; onClick: () => void }) => {
  console.log(song, "song....");
  return (
    <Card
      onClick={onClick}
      sx={{
        display: "flex",
        mb: 2,
        cursor: "pointer",
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <CardMedia
        component="img"
        image={song.thumbnail}
        alt={song.title}
        sx={{
          width: 100,
          height: 100,
          objectFit: "cover",
          borderRadius: "12px 0 0 12px",
        }}
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography variant="subtitle1" noWrap>
          {song.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Play Count: {song.playCount || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SongCard;
