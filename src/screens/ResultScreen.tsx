import FuturisticCard from "@/src/components/FuturisticCard";
import GenericResultCard from "@/src/components/GenericResultCard";
import ThemeToggle from "@/src/components/ThemeToggle";
import UPIResultCard from "@/src/components/UPIResultCard";
import { useScanStore } from "@/src/store/useScanStore";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useColorMode,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeftIcon, ScanIcon } from "lucide-react-native";
import { MotiView } from "moti";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemedColors } from "@/src/theme/colors";

export default function ResultScreen() {
  const router = useRouter();
  const { currentScan } = useScanStore();
  const colorMode = useColorMode();
  const isDark = colorMode === "dark";
  const statusBarStyle = useMemo(() => (isDark ? "light" : "dark"), [isDark]);
  const colors = useThemedColors();

  if (!currentScan) {
    return (
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        bg={isDark ? "$surfaceDark900" : "$surfaceLight100"}
      >
        <Text color={colors.textEmptyState} size="md">
          No scan data available
        </Text>
      </Box>
    );
  }

  const handleScanAgain = () => {
    router.back();
  };

  return (
    <Box flex={1} bg={isDark ? "$surfaceDark900" : "$surfaceLight50"}>
      <StatusBar style={statusBarStyle as any} />
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1}>
          <MotiView
            from={{ opacity: 0, translateY: -18 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 380 }}
          >
            <HStack
              px="$5"
              py="$4"
              alignItems="center"
              justifyContent="space-between"
            >
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Box
                  width={44}
                  height={44}
                  borderRadius="$pill"
                  alignItems="center"
                  justifyContent="center"
                  borderWidth={1}
                  borderColor={colors.controlBorder}
                  bg={colors.surfaceControl}
                >
                  <Icon
                    as={ArrowLeftIcon}
                    size="lg"
                    color={colors.textAccentDetail}
                  />
                </Box>
              </Pressable>

              <VStack alignItems="center" space="xs">
                <Text
                  size="lg"
                  fontWeight="$semibold"
                  color={colors.textPrimaryStrong}
                >
                  Scan Result
                </Text>
                <Box
                  height={2}
                  width={40}
                  borderRadius={999}
                  bg={colors.gradientBar}
                />
              </VStack>

              <ThemeToggle />
            </HStack>
          </MotiView>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
          >
            {currentScan.type === "UPI" ? (
              <UPIResultCard data={currentScan.data} rawUrl={currentScan.raw} />
            ) : (
              <GenericResultCard
                type={currentScan.type}
                data={currentScan.data}
                raw={currentScan.raw}
              />
            )}

            <MotiView
              from={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 360, delay: 200 }}
            >
              <Box px="$5" mt="$4">
                <Button
                  onPress={handleScanAgain}
                  variant="outline"
                  borderColor={colors.outlinePrimaryStrong}
                >
                  <ButtonIcon
                    as={ScanIcon}
                    mr="$2"
                    color={colors.accentIcon}
                  />
                  <ButtonText
                    color={colors.textHighlight}
                    fontWeight="$semibold"
                  >
                    Scan Another Code
                  </ButtonText>
                </Button>
              </Box>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 28 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 420, delay: 320 }}
            >
              <Box px="$5" mt="$5">
                <FuturisticCard>
                  <VStack space="md">
                    <Text
                      size="sm"
                      fontWeight="$semibold"
                      color={colors.sectionTitle}
                    >
                      Smart tips
                    </Text>
                    <Text
                      size="xs"
                      color={colors.sectionSubtitle}
                    >
                      Long press any field to copy exactly what you need. Share
                      securely using encrypted apps for sensitive data.
                    </Text>
                  </VStack>
                </FuturisticCard>
              </Box>
            </MotiView>
          </ScrollView>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
