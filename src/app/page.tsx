"use client";

import { useState, useEffect, useRef } from "react";
import { Container, Stack, Box, Typography } from "@mui/material";
import { getSushiSwapDashboard, getTopWallets } from "@/lib/api";
import { DashboardResponse, TopWalletsResponse, SushiSwap } from "@/lib/types";
import FilterButtons from "@/components/volume/FilterButtons";
import StatsCards from "@/components/volume/StatsCards";
import SwapsTable from "@/components/volume/SwapsTable";
import TopWalletsTable from "@/components/volume/TopWalletsTable";
import LoadingState from "@/components/volume/LoadingState";
import ErrorState from "@/components/volume/ErrorState";

export default function VolumePage() {
  const [swapType, setSwapType] = useState<
    "CLASSIC" | "LIMIT_ORDER" | undefined
  >(undefined);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [walletsData, setWalletsData] = useState<TopWalletsResponse | null>(
    null
  );
  const [showTopWallets, setShowTopWallets] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always fetch dashboard data for stats cards
        const dashboardResult = await getSushiSwapDashboard(swapType);
        setData(dashboardResult);
        console.log("Dashboard:", dashboardResult);

        // Conditionally fetch top wallets data
        if (showTopWallets) {
          const walletsResult = await getTopWallets(swapType);
          setWalletsData(walletsResult);
          console.log("Top wallets:", walletsResult);
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [swapType, showTopWallets]);

  // SSE connection for real-time CLASSIC swap updates
  useEffect(() => {
    // Only connect when viewing CLASSIC swaps (swapType undefined = all swaps, including CLASSIC)
    if (!showTopWallets && (swapType === undefined || swapType === "CLASSIC")) {
      const apiUrl = "https://api.aggtrade.xyz/tracking";
      const sseUrl = `${apiUrl}/sushiswap/stream`;

      console.log("Connecting to SSE:", sseUrl);
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const newSwap: SushiSwap = JSON.parse(event.data);
          console.log("New swap received:", newSwap);

          // Only add if swap type matches current filter
          if (swapType === undefined || newSwap.swap_type === swapType) {
            setData((prev) => {
              if (!prev) return prev;

              return {
                ...prev,
                swaps: [newSwap, ...prev.swaps],
                statistics: {
                  ...prev.statistics,
                  total_swaps: prev.statistics.total_swaps + 1,
                  total_volume_usd:
                    prev.statistics.total_volume_usd +
                    parseFloat(newSwap.usd_volume),
                  ...(newSwap.swap_type === "CLASSIC"
                    ? {
                        classic_swaps: prev.statistics.classic_swaps + 1,
                        classic_volume_usd:
                          prev.statistics.classic_volume_usd +
                          parseFloat(newSwap.usd_volume),
                      }
                    : {
                        limit_order_swaps:
                          prev.statistics.limit_order_swaps + 1,
                        limit_order_volume_usd:
                          prev.statistics.limit_order_volume_usd +
                          parseFloat(newSwap.usd_volume),
                      }),
                },
                pagination: {
                  ...prev.pagination,
                  returned: prev.pagination.returned + 1,
                },
              };
            });
          }
        } catch (err) {
          console.error("Failed to parse SSE message:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        eventSource.close();
      };

      return () => {
        console.log("Closing SSE connection");
        eventSource.close();
        eventSourceRef.current = null;
      };
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [swapType, showTopWallets]);

  const handleFilterChange = (
    filter: "CLASSIC" | "LIMIT_ORDER" | undefined
  ) => {
    setSwapType(filter);
    setShowTopWallets(false); // Reset top wallets when changing swap filter
  };

  const handleTopWalletsClick = () => {
    setShowTopWallets(!showTopWallets);
    if (!showTopWallets) {
      setSwapType(undefined); // Reset swap filter when showing top wallets
    }
  };

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
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 2,
            }}
          >
            SushiSwap Volume Dashboard
          </Typography>

          <FilterButtons
            activeFilter={swapType}
            onFilterChange={handleFilterChange}
            showTopWallets={showTopWallets}
            onTopWalletsClick={handleTopWalletsClick}
          />

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} />
          ) : data ? (
            <>
              <StatsCards
                totalSwaps={data.statistics.total_swaps}
                totalVolume={data.statistics.total_volume_usd}
                classicSwaps={data.statistics.classic_swaps}
                classicVolume={data.statistics.classic_volume_usd}
                limitOrderSwaps={data.statistics.limit_order_swaps}
                limitOrderVolume={data.statistics.limit_order_volume_usd}
              />

              {showTopWallets && walletsData ? (
                <>
                  <TopWalletsTable wallets={walletsData.wallets} />

                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Showing {walletsData.wallets.length} top wallets
                  </Typography>
                </>
              ) : (
                <>
                  <SwapsTable swaps={data.swaps} swapType={swapType} />

                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Showing {data.pagination.returned} of{" "}
                    {data.statistics.total_swaps} swaps
                  </Typography>
                </>
              )}
            </>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
