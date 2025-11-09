import { Box, useColorMode } from "@gluestack-ui/themed";
import React, { ReactNode } from "react";

import { useThemedColors } from "@/src/theme/colors";

interface FuturisticCardProps extends React.ComponentProps<typeof Box> {
  children: ReactNode;
}

export default function FuturisticCard({
  children,
  style,
  ...props
}: FuturisticCardProps) {
  const colorMode = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useThemedColors();

  return (
    <Box
      borderRadius="$4xl"
      borderWidth={1}
      borderColor={colors.cardBorder}
      bg={colors.surfaceCard}
      px="$5"
      py="$5"
      style={[
        {
          shadowColor: colors.accentShadow,
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: isDark ? 0.28 : 0.18,
          shadowRadius: 32,
          elevation: 20,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Box>
  );
}
