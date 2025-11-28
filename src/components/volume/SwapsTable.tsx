import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import GlowBox from "@/components/common/GlowBox";
import { SushiSwap } from "@/lib/types";

interface SwapsTableProps {
  swaps: SushiSwap[];
  swapType: "CLASSIC" | "LIMIT_ORDER" | undefined;
}

export default function SwapsTable({ swaps, swapType }: SwapsTableProps) {
  return (
    <GlowBox>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>Wallet</TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>Token In</TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>Token Out</TableCell>
              {swapType === "LIMIT_ORDER" && (
                <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>Filled</TableCell>
              )}
              <TableCell align="right" sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Volume (USD)
              </TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {swaps.map((swap) => (
              <TableRow
                key={swap.id}
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(0, 245, 224, 0.05)",
                  },
                }}
              >
                <TableCell>
                  <Chip
                    label={swap.swap_type}
                    size="small"
                    sx={{
                      bgcolor:
                        swap.swap_type === "CLASSIC"
                          ? "rgba(0, 123, 255, 0.2)"
                          : "rgba(138, 43, 226, 0.2)",
                      color: swap.swap_type === "CLASSIC" ? "#4dabf7" : "#9775fa",
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "white", fontFamily: "monospace" }}>
                  {swap.wallet_address.slice(0, 6)}...{swap.wallet_address.slice(-4)}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={swap.token_from_logo}
                      alt={swap.token_from_symbol}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      {parseFloat(swap.token_from_amount).toFixed(2)} {swap.token_from_symbol}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={swap.token_to_logo}
                      alt={swap.token_to_symbol}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      {parseFloat(swap.token_to_amount).toFixed(2)} {swap.token_to_symbol}
                    </Typography>
                  </Box>
                </TableCell>
                {swapType === "LIMIT_ORDER" && (
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
                    {swap.filled_src_amount && swap.filled_dst_amount ? (
                      <Box>
                        <div>In: {parseFloat(swap.filled_src_amount).toFixed(2)}</div>
                        <div>Out: {parseFloat(swap.filled_dst_amount).toFixed(2)}</div>
                      </Box>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                )}
                <TableCell align="right" sx={{ color: "#00F5E0", fontWeight: 600 }}>
                  ${parseFloat(swap.usd_volume).toFixed(2)}
                </TableCell>
                <TableCell sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {new Date(swap.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </GlowBox>
  );
}
