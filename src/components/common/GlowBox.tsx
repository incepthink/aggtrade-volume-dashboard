import { Box, type BoxProps } from "@mui/material";
import React from "react";

type GlowBoxProps = BoxProps & {
  children: React.ReactNode;
  padding?: number | string;
  spread?: number;
};

const GlowBox: React.FC<GlowBoxProps> = ({
  children,
  padding = 2,
  spread = 16,
  sx = {},
  ...rest
}) => {
  return (
    <Box
      sx={{
        boxShadow: `inset 0 1px ${spread}px rgba(0, 245, 224, 0.15)`,
        backgroundColor: "rgba(5, 12, 25, 0.3)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 245, 224, 0.2)",
        borderRadius: 2,
        p: padding,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default GlowBox;
