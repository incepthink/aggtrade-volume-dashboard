"use client";

import { useState, useEffect } from "react";
import { Button, CircularProgress, Paper } from "@mui/material";
import { getSushiSwapDashboard } from "@/lib/api";
import { DashboardResponse } from "@/lib/types";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">SushiSwap Volume Dashboard</h1>

        <div className="flex gap-4 mb-6">
          <Button
            variant={swapType === undefined ? "contained" : "outlined"}
            onClick={() => setSwapType(undefined)}
            className="!normal-case"
          >
            All Swaps
          </Button>
          <Button
            variant={swapType === "CLASSIC" ? "contained" : "outlined"}
            onClick={() => setSwapType("CLASSIC")}
            className="!normal-case"
          >
            Classic Swaps
          </Button>
          <Button
            variant={swapType === "LIMIT_ORDER" ? "contained" : "outlined"}
            onClick={() => setSwapType("LIMIT_ORDER")}
            className="!normal-case"
          >
            Limit Orders
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Paper className="p-4">
                <div className="text-sm text-gray-600">Total Swaps</div>
                <div className="text-2xl font-bold">
                  {data.statistics.total_swaps}
                </div>
              </Paper>
              <Paper className="p-4">
                <div className="text-sm text-gray-600">Total Volume</div>
                <div className="text-2xl font-bold">
                  ${data.statistics.total_volume_usd.toLocaleString()}
                </div>
              </Paper>
              <Paper className="p-4">
                <div className="text-sm text-gray-600">Classic Swaps</div>
                <div className="text-2xl font-bold">
                  {data.statistics.classic_swaps}
                </div>
                <div className="text-xs text-gray-500">
                  ${data.statistics.classic_volume_usd.toLocaleString()}
                </div>
              </Paper>
              <Paper className="p-4">
                <div className="text-sm text-gray-600">Limit Orders</div>
                <div className="text-2xl font-bold">
                  {data.statistics.limit_order_swaps}
                </div>
                <div className="text-xs text-gray-500">
                  ${data.statistics.limit_order_volume_usd.toLocaleString()}
                </div>
              </Paper>
            </div>

            <Paper className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Wallet
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Token In
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Token Out
                    </th>
                    {swapType === "LIMIT_ORDER" && (
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Filled
                      </th>
                    )}
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Volume (USD)
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.swaps.map((swap) => (
                    <tr key={swap.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            swap.swap_type === "CLASSIC"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {swap.swap_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {swap.wallet_address.slice(0, 6)}...
                        {swap.wallet_address.slice(-4)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {parseFloat(swap.token_from_amount).toFixed(2)}{" "}
                        {swap.token_from_symbol}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {parseFloat(swap.token_to_amount).toFixed(2)}{" "}
                        {swap.token_to_symbol}
                      </td>
                      {swapType === "LIMIT_ORDER" && (
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {swap.filled_src_amount && swap.filled_dst_amount ? (
                            <>
                              <div>
                                In: {parseFloat(swap.filled_src_amount).toFixed(2)}
                              </div>
                              <div>
                                Out: {parseFloat(swap.filled_dst_amount).toFixed(2)}
                              </div>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        ${parseFloat(swap.usd_volume).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(swap.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paper>

            <div className="mt-4 text-sm text-gray-600">
              Showing {data.pagination.returned} of{" "}
              {data.statistics.total_swaps} swaps
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
