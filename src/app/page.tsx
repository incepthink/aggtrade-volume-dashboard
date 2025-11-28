"use client";

import { useState, useEffect } from "react";
import { Container, Stack, Box, Typography } from "@mui/material";
import { getSushiSwapDashboard } from "@/lib/api";
import { DashboardResponse } from "@/lib/types";
import FilterButtons from "@/components/volume/FilterButtons";
import StatsCards from "@/components/volume/StatsCards";
import SwapsTable from "@/components/volume/SwapsTable";
import LoadingState from "@/components/volume/LoadingState";
import ErrorState from "@/components/volume/ErrorState";

export default function VolumePage() {
  const [swapType, setSwapType] = useState<
    "CLASSIC" | "LIMIT_ORDER" | undefined
  >(undefined);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getSushiSwapDashboard(swapType);
        setData(result);
        console.log(result);
      } catch (err) {
        setError("Failed to fetch swap data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [swapType]);

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

          <FilterButtons activeFilter={swapType} onFilterChange={setSwapType} />

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

              <SwapsTable swaps={data.swaps} swapType={swapType} />

              <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.875rem" }}>
                Showing {data.pagination.returned} of {data.statistics.total_swaps} swaps
              </Typography>
            </>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
