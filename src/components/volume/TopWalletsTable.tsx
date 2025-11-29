import {
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
import { TopWallet } from "@/lib/types";

interface TopWalletsTableProps {
  wallets: TopWallet[];
}

export default function TopWalletsTable({ wallets }: TopWalletsTableProps) {
  return (
    <GlowBox>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Rank
              </TableCell>
              <TableCell sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Wallet Address
              </TableCell>
              <TableCell align="right" sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Total Volume (USD)
              </TableCell>
              <TableCell align="right" sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Total Swaps
              </TableCell>
              <TableCell align="right" sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Classic Swaps
              </TableCell>
              <TableCell align="right" sx={{ color: "#00F5E0", fontWeight: 600 }}>
                Limit Orders
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets.map((wallet, index) => (
              <TableRow
                key={wallet.wallet_address}
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(0, 245, 224, 0.05)",
                  },
                }}
              >
                <TableCell>
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                      bgcolor: index === 0
                        ? "rgba(255, 215, 0, 0.2)"
                        : index === 1
                        ? "rgba(192, 192, 192, 0.2)"
                        : index === 2
                        ? "rgba(205, 127, 50, 0.2)"
                        : "rgba(0, 245, 224, 0.1)",
                      color: index === 0
                        ? "#FFD700"
                        : index === 1
                        ? "#C0C0C0"
                        : index === 2
                        ? "#CD7F32"
                        : "#00F5E0",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "white", fontFamily: "monospace" }}>
                  {wallet.wallet_address.slice(0, 6)}...
                  {wallet.wallet_address.slice(-4)}
                </TableCell>
                <TableCell align="right" sx={{ color: "#00F5E0", fontWeight: 600 }}>
                  ${wallet.total_volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  {wallet.swap_count.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  {wallet.classic_count.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  {wallet.limit_order_count.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </GlowBox>
  );
}
