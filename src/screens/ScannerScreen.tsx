import QRScannerView from "@/src/components/QRScannerView";
import ThemeToggle from "@/src/components/ThemeToggle";
import { useScanStore } from "@/src/store/useScanStore";
import { useThemedColors } from "@/src/theme/colors";
import { parseQRCodeContent } from "@/src/utils/qrParser";
import {
  Box,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  useColorMode,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Clock, QrCode, Scan } from "lucide-react-native";
import { MotiView } from "moti";
import { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScannerScreen() {
  const router = useRouter();
  const { setCurrentScan, addToHistory, setIsScanning, loadHistory } =
    useScanStore();
  const colorMode = useColorMode();
  const isDark = colorMode === "dark";
  const statusBarStyle = isDark ? "light" : "dark";
  const insets = useSafeAreaInsets();
  const colors = useThemedColors();

  useEffect(() => {
    loadHistory();
    setIsScanning(true);
    return () => setIsScanning(false);
  }, []);

  const handleCodeScanned = (code: string) => {
    setIsScanning(false);
    const parsedData = parseQRCodeContent(code);
    setCurrentScan(parsedData);
    addToHistory(parsedData);
    router.push("/result");
  };

  const handleHistoryPress = () => router.push("/history");

  const theme = useMemo(
    () => ({
      cardBg: colors.surfaceCardRaised,
      borderColor: colors.outlineNeutralStrong,
      primaryBg: colors.surfaceAccent,
      primaryColor: colors.brandPrimary,
      textPrimary: colors.textPrimaryAlt,
      textSecondary: colors.textMutedAlt,
      accentBg: colors.surfaceAccentAlt,
      accentColor: colors.accentTertiary,
      textAccent: colors.textAccentInverse,
      textMuted: colors.textMutedAccent,
      scanBorder: colors.outlineScan,
      shadow: colors.neutralShadow,
      bottomShadow: colors.bottomCardShadow,
    }),
    [colors]
  );

  const renderHeader = () => (
    <Box
      px="$5"
      py="$4"
      bg={theme.cardBg}
      borderBottomWidth={1}
      borderBottomColor={theme.borderColor}
      style={[
        styles.headerShadow,
        { paddingTop: insets.top + 16, shadowColor: theme.shadow },
      ]}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <HStack space="sm" alignItems="center" flex={1}>
          <Box
            width={40}
            height={40}
            borderRadius="$pill"
            alignItems="center"
            justifyContent="center"
            bg={theme.primaryBg}
          >
            <Icon as={QrCode} size="lg" color={theme.primaryColor} />
          </Box>
          <VStack space="xs" flex={1}>
            <Text color={theme.textPrimary} size="md" fontWeight="$semibold">
              Global QR
            </Text>
            <Text color={theme.textSecondary} size="xs">
              Fast & secure scanning
            </Text>
          </VStack>
        </HStack>

        <HStack space="sm" alignItems="center">
          <ThemeToggle />
          <Pressable onPress={handleHistoryPress} accessibilityRole="button">
            <Box
              width={44}
              height={44}
              borderRadius="$pill"
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor={theme.borderColor}
              bg={theme.cardBg}
            >
              <Icon as={Clock} size="lg" color={theme.primaryColor} />
            </Box>
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );

  const renderBottomCard = () => (
    <Box
      px="$5"
      pb="$6"
      bg={theme.cardBg}
      borderTopWidth={1}
      borderTopColor={theme.borderColor}
      style={[
        styles.bottomCardShadow,
        { paddingBottom: insets.bottom + 24, shadowColor: theme.bottomShadow },
      ]}
    >
      <Box
        px="$4"
        py="$4"
        borderRadius="$3xl"
        borderWidth={1}
        borderColor={theme.scanBorder}
        bg={theme.cardBg}
        mt="$4"
      >
        <HStack space="md" alignItems="center">
          <Box
            width={36}
            height={36}
            borderRadius="$pill"
            alignItems="center"
            justifyContent="center"
            bg={theme.accentBg}
          >
            <Icon as={Scan} size="md" color={theme.accentColor} />
          </Box>
          <VStack space="xs" flex={1}>
            <Text size="sm" fontWeight="$semibold" color={theme.textAccent}>
              Supports UPI, URLs, Wi-Fi & More
            </Text>
            <Text size="xs" color={theme.textMuted}>
              Align code within frame for instant scanning
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );

  return (
    <Box flex={1} bg={colors.surfaceCard}>
      <StatusBar style={statusBarStyle} />
      <Box style={StyleSheet.absoluteFill}>
        <QRScannerView onCodeScanned={handleCodeScanned} isActive={true} />
      </Box>
      <Box style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
          pointerEvents="box-none"
        >
          {renderHeader()}
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 200 }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          pointerEvents="box-none"
        >
          {renderBottomCard()}
        </MotiView>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomCardShadow: {
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
});
