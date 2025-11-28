import { Typography } from "@mui/material";
import GlowBox from "@/components/common/GlowBox";

interface StatsCardsProps {
  totalSwaps: number;
  totalVolume: number;
  classicSwaps: number;
  classicVolume: number;
  limitOrderSwaps: number;
  limitOrderVolume: number;
}

export default function StatsCards({
  totalSwaps,
  totalVolume,
  classicSwaps,
  classicVolume,
  limitOrderSwaps,
  limitOrderVolume,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlowBox>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
          Total Swaps
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          {totalSwaps}
        </Typography>
      </GlowBox>

      <GlowBox>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
          Total Volume
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          ${totalVolume.toLocaleString()}
        </Typography>
      </GlowBox>

      <GlowBox>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
          Classic Swaps
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          {classicSwaps}
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)" }}>
          ${classicVolume.toLocaleString()}
        </Typography>
      </GlowBox>

      <GlowBox>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
          Limit Orders
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          {limitOrderSwaps}
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)" }}>
          ${limitOrderVolume.toLocaleString()}
        </Typography>
      </GlowBox>
    </div>
  );
}
