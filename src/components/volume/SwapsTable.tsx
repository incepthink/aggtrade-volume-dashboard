"use client";

import { useState, useEffect } from "react";
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

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
}

export default function SwapsTable({ swaps, swapType }: SwapsTableProps) {
  const [, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <GlowBox>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Type
              </TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Wallet
              </TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Sell
              </TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Buy
              </TableCell>
              {swapType === "LIMIT_ORDER" && (
                <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                  Filled
                </TableCell>
              )}
              <TableCell
                align="right"
                sx={{ color: "#00F5E0", fontWeight: 600 }}
              >
                Volume (USD)
              </TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Time
              </TableCell>
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
                    label={swapType === undefined ? "SWAP" : swap.swap_type}
                    size="small"
                    sx={{
                      bgcolor:
                        swap.swap_type === "CLASSIC"
                          ? "rgba(0, 123, 255, 0.2)"
                          : "rgba(138, 43, 226, 0.2)",
                      color:
                        swap.swap_type === "CLASSIC" ? "#4dabf7" : "#9775fa",
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "white", fontFamily: "monospace" }}>
                  {swap.wallet_address.slice(0, 6)}...
                  {swap.wallet_address.slice(-4)}
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
                      {parseFloat(swap.token_from_amount).toFixed(4)}{" "}
                      {swap.token_from_symbol}
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
                      {Number(swap.token_to_amount) === 0
                        ? parseFloat(swap.filled_dst_amount || "0").toFixed(4)
                        : parseFloat(swap.token_to_amount).toFixed(4)}{" "}
                      {swap.token_to_symbol}
                    </Typography>
                  </Box>
                </TableCell>
                {swapType === "LIMIT_ORDER" && (
                  <TableCell
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {swap.filled_src_amount && swap.filled_dst_amount ? (
                      <Box>
                        <div>
                          In: {parseFloat(swap.filled_src_amount).toFixed(4)}
                        </div>
                        <div>
                          Out: {parseFloat(swap.filled_dst_amount).toFixed(4)}
                        </div>
                      </Box>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                )}
                <TableCell
                  align="right"
                  sx={{ color: "#00F5E0", fontWeight: 600 }}
                >
                  ${parseFloat(swap.usd_volume).toFixed(2)}
                </TableCell>
                <TableCell sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {getRelativeTime(swap.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </GlowBox>
  );
}
