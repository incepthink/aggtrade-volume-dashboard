import { Button, Stack } from "@mui/material";

interface FilterButtonsProps {
  activeFilter: "CLASSIC" | "LIMIT_ORDER" | undefined;
  onFilterChange: (filter: "CLASSIC" | "LIMIT_ORDER" | undefined) => void;
  showTopWallets: boolean;
  onTopWalletsClick: () => void;
}

export default function FilterButtons({
  activeFilter,
  onFilterChange,
  showTopWallets,
  onTopWalletsClick,
}: FilterButtonsProps) {
  const buttonStyle = (isActive: boolean) => ({
    textTransform: "none",
    bgcolor: isActive ? "#00F5E0" : "transparent",
    color: isActive ? "#050C19" : "#00F5E0",
    borderColor: "#00F5E0",
    "&:hover": {
      bgcolor: isActive ? "#00d4c4" : "rgba(0, 245, 224, 0.1)",
      borderColor: "#00F5E0",
    },
  });

  // Swap filters should only be active when NOT in Top Wallets mode
  const isFilterActive = (filter: "CLASSIC" | "LIMIT_ORDER" | undefined) =>
    !showTopWallets && activeFilter === filter;

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant={isFilterActive(undefined) ? "contained" : "outlined"}
        onClick={() => onFilterChange(undefined)}
        sx={buttonStyle(isFilterActive(undefined))}
      >
        All Swaps
      </Button>

      <Button
        variant={isFilterActive("CLASSIC") ? "contained" : "outlined"}
        onClick={() => onFilterChange("CLASSIC")}
        sx={buttonStyle(isFilterActive("CLASSIC"))}
      >
        Classic Swaps
      </Button>

      <Button
        variant={isFilterActive("LIMIT_ORDER") ? "contained" : "outlined"}
        onClick={() => onFilterChange("LIMIT_ORDER")}
        sx={buttonStyle(isFilterActive("LIMIT_ORDER"))}
      >
        Limit Orders
      </Button>

      <Button
        variant={showTopWallets ? "contained" : "outlined"}
        onClick={onTopWalletsClick}
        sx={buttonStyle(showTopWallets)}
      >
        Top Wallets
      </Button>
    </Stack>
  );
}
