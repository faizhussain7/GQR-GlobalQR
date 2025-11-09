import { useColorMode } from "@gluestack-ui/themed";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { themeColorTokens, useThemedColors } from "@/src/theme/colors";

const AnimatedView = Animated.View;

export function FuturisticBackground() {
  const colorMode = useColorMode();
  const colors = useThemedColors();
  const wave = useSharedValue(0);
  const pulse = useSharedValue(0);
  const primaryStart = themeColorTokens.backgroundGlowPrimary[colorMode];
  const primaryEnd = themeColorTokens.backgroundGlowSecondary[colorMode];
  const secondaryStart = themeColorTokens.backgroundGlowTertiary[colorMode];
  const secondaryEnd = themeColorTokens.backgroundGlowAccent[colorMode];

  useEffect(() => {
    wave.value = withRepeat(withTiming(1, { duration: 8500 }), -1, true);
    pulse.value = withRepeat(withTiming(1, { duration: 5400 }), -1, true);
  }, [pulse, wave]);

  const blobPrimary = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(wave.value, [0, 1], [-40, 40]) },
      { translateY: interpolate(wave.value, [0, 1], [-80, 60]) },
      {
        scale: interpolate(wave.value, [0, 0.5, 1], [1.05, 1.25, 1.1]),
      },
    ],
    opacity: interpolate(wave.value, [0, 0.5, 1], [0.45, 0.85, 0.55]),
    backgroundColor: interpolateColor(
      wave.value,
      [0, 1],
      [primaryStart, primaryEnd]
    ),
  }));

  const blobSecondary = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(pulse.value, [0, 1], [120, 30]) },
      { translateY: interpolate(pulse.value, [0, 1], [80, 160]) },
      {
        scale: interpolate(pulse.value, [0, 0.5, 1], [1.1, 1.3, 1.2]),
      },
    ],
    opacity: interpolate(pulse.value, [0, 0.5, 1], [0.35, 0.55, 0.4]),
    backgroundColor: interpolateColor(
      pulse.value,
      [0, 1],
      [secondaryStart, secondaryEnd]
    ),
  }));

  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <AnimatedView style={[styles.blob, styles.primary, blobPrimary]} />
      <AnimatedView style={[styles.blob, styles.secondary, blobSecondary]} />
      <AnimatedView
        style={[styles.overlay, { backgroundColor: colors.backgroundOverlay }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 320,
  },
  primary: {
    top: -120,
    left: -140,
  },
  secondary: {
    bottom: -160,
    right: -120,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default FuturisticBackground;

