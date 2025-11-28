"use client";

import { useEffect, useState } from "react";
import { getExecutionDetails, getPortfolioSnapshots } from "@/lib/api";
import { ExecutionDetails, PortfolioSnapshot } from "@/lib/types";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import GlowBox from "@/components/common/GlowBox";

export default function ExecutionPage() {
  const params = useParams();
  const executionId = params.id as string;

  const [details, setDetails] = useState<ExecutionDetails | null>(null);
  const [snapshots, setSnapshots] = useState<
    Record<string, PortfolioSnapshot[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!executionId) return;

    getExecutionDetails(executionId)
      .then(async (data) => {
        setDetails(data);

        // Fetch portfolio snapshots for each wallet
        const snapshotPromises = data.wallets.map(async (wallet) => {
          try {
            const snaps = await getPortfolioSnapshots(
              executionId,
              wallet.wallet_address
            );
            return {
              address: wallet.wallet_address,
              snapshots: snaps.snapshots,
            };
          } catch (err) {
            console.error(
              `Failed to fetch snapshots for ${wallet.wallet_address}`,
              err
            );
            return { address: wallet.wallet_address, snapshots: [] };
          }
        });

        const results = await Promise.all(snapshotPromises);
        const snapshotMap = results.reduce((acc, { address, snapshots }) => {
          acc[address] = snapshots;
          return acc;
        }, {} as Record<string, PortfolioSnapshot[]>);

        setSnapshots(snapshotMap);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load execution details");
      })
      .finally(() => setLoading(false));
  }, [executionId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#050C19",
        }}
      >
        <CircularProgress sx={{ color: "#00F5E0" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#050C19",
        }}
      >
        <Typography sx={{ color: "#ff6b6b", fontSize: "1.125rem" }}>{error}</Typography>
      </Box>
    );
  }

  if (!details) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#050C19",
        }}
      >
        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1.125rem" }}>
          Execution not found
        </Typography>
      </Box>
    );
  }

  const { execution, wallets } = details;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#050C19",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box sx={{ mb: 2 }}>
            <Link
              href="/bot"
              style={{
                color: "#00F5E0",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "16px",
              }}
            >
              ← Back to Executions
            </Link>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 1,
              }}
            >
              Execution Details
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              ID: {execution.execution_id}
            </Typography>
          </Box>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlowBox>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
              >
                Strategy
              </Typography>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                {execution.strategy_name}
              </Typography>
            </GlowBox>
            <GlowBox>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
              >
                Total Wallets
              </Typography>
              <Typography variant="h5" sx={{ color: "#00F5E0", fontWeight: 700 }}>
                {execution.total_wallets}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)" }}>
                {execution.completed_wallets} completed
                {execution.failed_wallets > 0 && `, ${execution.failed_wallets} failed`}
              </Typography>
            </GlowBox>
            <GlowBox>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
              >
                Total Volume
              </Typography>
              <Typography variant="h5" sx={{ color: "#00F5E0", fontWeight: 700 }}>
                ${execution.total_volume_usd.toLocaleString()}
              </Typography>
            </GlowBox>
            <GlowBox>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}
              >
                Status
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color:
                    execution.status === "completed"
                      ? "#4ade80"
                      : execution.status === "running"
                      ? "#60a5fa"
                      : "#f87171",
                  fontWeight: 700,
                }}
              >
                {execution.status}
              </Typography>
            </GlowBox>
          </div>

          <GlowBox>
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: 2,
                pb: 2,
                borderBottom: "1px solid rgba(0, 245, 224, 0.2)",
              }}
            >
              Wallets
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Index
                    </TableCell>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Address
                    </TableCell>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Tokens
                    </TableCell>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Swaps
                    </TableCell>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Capital Before
                    </TableCell>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Capital After
                    </TableCell>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Change
                    </TableCell>
                    <TableCell sx={{ color: "#00F5E0", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wallets.map((wallet) => {
                    const walletSnapshots = snapshots[wallet.wallet_address] || [];
                    const capitalBefore = walletSnapshots[0]?.total_capital_usd || 0;
                    const capitalAfter =
                      walletSnapshots[walletSnapshots.length - 1]?.total_capital_usd || 0;
                    const change = capitalAfter - capitalBefore;
                    const changePercent = capitalBefore > 0 ? (change / capitalBefore) * 100 : 0;

                    return (
                      <TableRow
                        key={wallet.wallet_index}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(0, 245, 224, 0.05)",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          {wallet.wallet_index}
                        </TableCell>
                        <TableCell sx={{ color: "white", fontFamily: "monospace" }}>
                          {wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {wallet.tokens.map((token, idx) => (
                              <Chip
                                key={idx}
                                label={token}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(59, 130, 246, 0.2)",
                                  color: "#60a5fa",
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {wallet.swaps_completed}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>${capitalBefore}</TableCell>
                        <TableCell sx={{ color: "white" }}>${capitalAfter}</TableCell>
                        <TableCell>
                          <Box sx={{ color: change >= 0 ? "#4ade80" : "#f87171" }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                              {change >= 0 ? "+" : ""}${change.toFixed(2)}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem" }}>
                              ({changePercent >= 0 ? "+" : ""}
                              {changePercent.toFixed(2)}%)
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              label={wallet.status}
                              size="small"
                              sx={{
                                bgcolor:
                                  wallet.status === "completed"
                                    ? "rgba(34, 197, 94, 0.2)"
                                    : wallet.status === "running"
                                    ? "rgba(59, 130, 246, 0.2)"
                                    : wallet.status === "failed"
                                    ? "rgba(239, 68, 68, 0.2)"
                                    : "rgba(156, 163, 175, 0.2)",
                                color:
                                  wallet.status === "completed"
                                    ? "#4ade80"
                                    : wallet.status === "running"
                                    ? "#60a5fa"
                                    : wallet.status === "failed"
                                    ? "#f87171"
                                    : "#9ca3af",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            />
                            {wallet.error_message && (
                              <Typography
                                sx={{
                                  fontSize: "0.75rem",
                                  color: "#f87171",
                                  mt: 0.5,
                                }}
                                title={wallet.error_message}
                              >
                                Error
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </GlowBox>
        </Stack>
      </Container>
    </Box>
  );
}
