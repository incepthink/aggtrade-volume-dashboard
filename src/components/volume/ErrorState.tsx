import { Typography } from "@mui/material";
import GlowBox from "@/components/common/GlowBox";

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <GlowBox>
      <Typography sx={{ color: "#ff6b6b" }}>{message}</Typography>
    </GlowBox>
  );
}
