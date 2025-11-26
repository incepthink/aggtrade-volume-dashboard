"use client";

import { useEffect, useState } from "react";
import { getExecutionDetails, getPortfolioSnapshots } from "@/lib/api";
import { ExecutionDetails, PortfolioSnapshot } from "@/lib/types";
import { useParams } from "next/navigation";
import Link from "next/link";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Execution not found</div>
      </div>
    );
  }

  const { execution, wallets } = details;

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Executions
        </Link>
        <h1 className="text-3xl font-bold mb-2">Execution Details</h1>
        <p className="text-gray-600 font-mono text-sm">
          ID: {execution.execution_id}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Strategy</div>
          <div className="text-2xl font-bold">{execution.strategy_name}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Wallets</div>
          <div className="text-2xl font-bold">{execution.total_wallets}</div>
          <div className="text-xs text-gray-500 mt-1">
            {execution.completed_wallets} completed
            {execution.failed_wallets > 0 &&
              `, ${execution.failed_wallets} failed`}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total Volume</div>
          <div className="text-2xl font-bold">
            ${execution.total_volume_usd.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Status</div>
          <div
            className={`text-2xl font-bold ${
              execution.status === "completed"
                ? "text-green-600"
                : execution.status === "running"
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {execution.status}
          </div>
        </div>
      </div>

      {/* Wallet Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Wallets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Index
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Swaps
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capital Before
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capital After
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wallets.map((wallet) => {
                const walletSnapshots = snapshots[wallet.wallet_address] || [];
                const capitalBefore =
                  walletSnapshots[0]?.total_capital_usd || 0;
                const capitalAfter =
                  walletSnapshots[walletSnapshots.length - 1]
                    ?.total_capital_usd || 0;
                const change = capitalAfter - capitalBefore;
                const changePercent =
                  capitalBefore > 0 ? (change / capitalBefore) * 100 : 0;

                return (
                  <tr key={wallet.wallet_index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {wallet.wallet_index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {wallet.wallet_address.slice(0, 6)}...
                      {wallet.wallet_address.slice(-4)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex gap-1 flex-wrap">
                        {wallet.tokens.map((token, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium"
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {wallet.swaps_completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${capitalBefore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${capitalAfter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div
                        className={
                          change >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        <div className="font-semibold">
                          {change >= 0 ? "+" : ""}${change.toFixed(2)}
                        </div>
                        <div className="text-xs">
                          ({changePercent >= 0 ? "+" : ""}
                          {changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          wallet.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : wallet.status === "running"
                            ? "bg-blue-100 text-blue-800"
                            : wallet.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {wallet.status}
                      </span>
                      {wallet.error_message && (
                        <div
                          className="text-xs text-red-600 mt-1"
                          title={wallet.error_message}
                        >
                          Error
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
