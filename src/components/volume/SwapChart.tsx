"use client";

import { useEffect, useRef, useState } from "react";
import { Typography, CircularProgress, ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import GlowBox from "@/components/common/GlowBox";
import { createChart, IChartApi, ISeriesApi, Time, AreaSeries } from "lightweight-charts";
import { getSushiSwapChartData } from "@/lib/api";
import { ChartDataPoint } from "@/lib/types";

type ChartMetric = "volume" | "swaps";

const glassContainerSx = {
  background:
    "linear-gradient(135deg, rgba(0, 245, 224, 0.05) 0%, rgba(5, 12, 25, 0.6) 100%)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(0, 245, 224, 0.15)",
  boxShadow: `
    0 4px 24px 0 rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(0, 245, 224, 0.08)
  `,
};

export default function SwapChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<ChartMetric>("volume");

  // Fetch chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSushiSwapChartData();
        // Sort by date ascending
        const sortedData = [...data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setChartData(sortedData);
      } catch (err) {
        setError("Failed to load chart data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current || loading || chartData.length === 0) return;

    const container = chartContainerRef.current;
    const rect = container.getBoundingClientRect();

    // Create chart if not exists
    if (!chartRef.current) {
      const chart = createChart(container, {
        layout: {
          background: { color: "transparent" },
          textColor: "#fff",
        },
        grid: {
          vertLines: { color: "#ffffff10" },
          horzLines: { color: "#ffffff10" },
        },
        width: rect.width,
        height: rect.height,
        rightPriceScale: {
          borderColor: "#ffffff20",
        },
        timeScale: {
          borderColor: "#ffffff20",
          timeVisible: true,
        },
        crosshair: {
          horzLine: {
            color: "#ffffff40",
          },
          vertLine: {
            color: "#ffffff40",
          },
        },
      });

      chartRef.current = chart;

      // Handle resize
      const resizeObserver = new ResizeObserver((entries) => {
        if (chartRef.current && entries[0]) {
          const { width, height } = entries[0].contentRect;
          chartRef.current.applyOptions({ width, height });
        }
      });
      resizeObserver.observe(container);

      // Cleanup
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [loading, chartData.length]);

  // Update series when metric or data changes
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    // Remove existing series
    if (seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
    }

    // Create new series with appropriate colors
    const isVolume = metric === "volume";
    const series = chartRef.current.addSeries(AreaSeries, {
      lineColor: isVolume ? "#22c55e" : "#3b82f6",
      topColor: isVolume ? "rgba(34, 197, 94, 0.4)" : "rgba(59, 130, 246, 0.4)",
      bottomColor: isVolume ? "rgba(34, 197, 94, 0.05)" : "rgba(59, 130, 246, 0.05)",
      lineWidth: 2,
      priceFormat: {
        type: isVolume ? "price" : "volume",
        precision: isVolume ? 2 : 0,
        minMove: isVolume ? 0.01 : 1,
      },
    });

    seriesRef.current = series;

    // Set data
    const formattedData = chartData.map((point) => ({
      time: (Date.parse(point.date) / 1000) as Time,
      value: metric === "volume" ? point.totalVolumeUSD : point.totalSwaps,
    }));

    series.setData(formattedData);
    chartRef.current.timeScale().fitContent();
  }, [chartData, metric]);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, []);

  const handleMetricChange = (
    _: React.MouseEvent<HTMLElement>,
    newMetric: ChartMetric | null
  ) => {
    if (newMetric) {
      setMetric(newMetric);
    }
  };

  if (loading) {
    return (
      <GlowBox
        sx={{
          ...glassContainerSx,
          p: 3,
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#22c55e" }} />
      </GlowBox>
    );
  }

  if (error) {
    return (
      <GlowBox
        sx={{
          ...glassContainerSx,
          p: 3,
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error">{error}</Typography>
      </GlowBox>
    );
  }

  return (
    <GlowBox
      sx={{
        ...glassContainerSx,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 600,
          }}
        >
          Cumulative Swap {metric === "volume" ? "Volume (USD)" : "Count"}
        </Typography>

        <ToggleButtonGroup
          value={metric}
          exclusive
          onChange={handleMetricChange}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              color: "rgba(255, 255, 255, 0.6)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              textTransform: "none",
              px: 2,
              "&.Mui-selected": {
                bgcolor: "rgba(34, 197, 94, 0.2)",
                color: "#22c55e",
                "&:hover": {
                  bgcolor: "rgba(34, 197, 94, 0.3)",
                },
              },
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            },
          }}
        >
          <ToggleButton value="volume">Volume</ToggleButton>
          <ToggleButton value="swaps">Swaps</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        ref={chartContainerRef}
        sx={{
          height: 350,
          width: "100%",
        }}
      />
    </GlowBox>
  );
}
