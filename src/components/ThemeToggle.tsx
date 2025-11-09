import { useAppColorMode } from "@/src/theme/colorModeManager";
import { themeColorTokens, useThemedColors } from "@/src/theme/colors";
import { Icon, Pressable } from "@gluestack-ui/themed";
import { Moon, Sun } from "lucide-react-native";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function DynamicThemeToggle() {
  const { colorMode, toggleColorMode, hydrated } = useAppColorMode();
  const colors = useThemedColors();
  const progress = useSharedValue(colorMode === "dark" ? 1 : 0);
  const [track, setTrack] = useState({ width: 0, height: 0 });
  const [knobSize, setKnobSize] = useState(24);

  useEffect(() => {
    progress.value = withTiming(colorMode === "dark" ? 1 : 0, {
      duration: 350,
    });
  }, [colorMode]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [
        themeColorTokens.toggleBackground.light,
        themeColorTokens.toggleBackground.dark,
      ]
    ),
  }));

  const knobStyle = useAnimatedStyle(() => {
    if (!track.width || !knobSize) return {};
    const range = Math.max(track.width - knobSize - 4, 0);
    return {
      transform: [
        {
          translateX: withSpring(progress.value * range, {
            damping: 14,
            stiffness: 180,
            mass: 0.7,
          }),
        },
        {
          scale: withSpring(progress.value === 0.5 ? 1.1 : 1, {
            damping: 18,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setTrack({ width, height });
    setKnobSize(height - 4);
  };

  const onTogglePress = () => {
    if (!hydrated) return;
    toggleColorMode();
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: hydrated ? 1 : 0.4, scale: hydrated ? 1 : 0.93 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <Pressable
        onPress={onTogglePress}
        accessibilityRole="switch"
        accessibilityState={{ checked: colorMode === "dark" }}
        accessibilityLabel={`Switch to ${
          colorMode === "dark" ? "light" : "dark"
        } mode`}
        disabled={!hydrated}
      >
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed ? 0.94 : 1 }}
            transition={{ type: "timing", duration: 80 }}
          >
            <Animated.View
              onLayout={onTrackLayout}
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  alignSelf: "flex-start",
                  borderColor: colors.outlineNeutralStrong,
                  borderWidth: 1.5,
                  borderRadius: 9999,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  position: "relative",
                  overflow: "visible",
                  gap: 8,
                },
                trackStyle,
              ]}
            >
              <Icon as={Sun} size="md" color="$amber500" />
              <Icon as={Moon} size="md" color="$indigo400" />
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    zIndex: 10,
                    backgroundColor:
                      themeColorTokens.knobBackground[colorMode] || "white",
                    width: knobSize,
                    height: knobSize,
                    aspectRatio: 1,
                    borderRadius: 9999,
                  },
                  knobStyle,
                ]}
              />
            </Animated.View>
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}
