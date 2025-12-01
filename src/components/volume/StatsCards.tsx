import { Typography } from "@mui/material";
import GlowBox from "@/components/common/GlowBox";

interface StatsCardsProps {
  totalSwaps: number; // filtered
  totalVolume: number; // filtered
  classicSwaps: number; // full (unfiltered)
  classicVolume: number; // full (unfiltered)
  limitOrderSwaps: number; // full (unfiltered)
  limitOrderVolume: number; // full (unfiltered)
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
      {/* Total Swaps - filtered */}
      <GlowBox>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
        >
          Total Swaps
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          {totalSwaps.toLocaleString()}
        </Typography>
      </GlowBox>

      {/* Total Volume - filtered */}
      <GlowBox>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
        >
          Total Volume
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          ${totalVolume.toLocaleString()}
        </Typography>
      </GlowBox>

      {/* Classic Swaps - always full stats */}
      <GlowBox>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
        >
          Classic Swaps
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          {classicSwaps.toLocaleString()}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.4)" }}
        >
          ${classicVolume.toLocaleString()}
        </Typography>
      </GlowBox>

      {/* Limit Orders - always full stats */}
      <GlowBox>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
        >
          Limit Orders
        </Typography>
        <Typography variant="h4" sx={{ color: "#00F5E0", fontWeight: 700 }}>
          {limitOrderSwaps.toLocaleString()}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.4)" }}
        >
          ${limitOrderVolume.toLocaleString()}
        </Typography>
      </GlowBox>
    </div>
  );
}
