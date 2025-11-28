import { Box, CircularProgress } from "@mui/material";

export default function LoadingState() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
      }}
    >
      <CircularProgress sx={{ color: "#00F5E0" }} />
    </Box>
  );
}
