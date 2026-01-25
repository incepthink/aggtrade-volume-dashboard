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

const glassCardSx = {
  background:
    "linear-gradient(135deg, rgba(0, 245, 224, 0.08) 0%, rgba(5, 12, 25, 0.6) 100%)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(0, 245, 224, 0.15)",
  boxShadow: `
    0 4px 24px 0 rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(0, 245, 224, 0.1)
  `,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: `
      0 8px 32px 0 rgba(0, 245, 224, 0.2),
      inset 0 1px 0 rgba(0, 245, 224, 0.2),
      0 0 20px rgba(0, 245, 224, 0.15)
    `,
    border: "1px solid rgba(0, 245, 224, 0.4)",
    background:
      "linear-gradient(135deg, rgba(0, 245, 224, 0.12) 0%, rgba(5, 12, 25, 0.7) 100%)",
  },
  "&:active": {
    transform: "translateY(-2px) scale(1.01)",
  },
};

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
      <GlowBox sx={glassCardSx}>
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
      <GlowBox sx={glassCardSx}>
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
      <GlowBox sx={glassCardSx}>
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
      <GlowBox sx={glassCardSx}>
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
