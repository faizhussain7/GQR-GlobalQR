import FuturisticCard from "@/src/components/FuturisticCard";
import { useThemedColors } from "@/src/theme/colors";
import {
  fetchUPIApps,
  formatAmount,
  getCachedUPIApps,
  openUPIApp,
  type UPIApp,
} from "@/src/utils/upiHandler";
import {
  Box,
  HStack,
  Icon,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { CreditCardIcon } from "lucide-react-native";
import { MotiView } from "moti";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface UPIResultCardProps {
  data: {
    pa: string;
    pn: string;
    am: string;
    tn: string;
    cu: string;
    mc: string;
    tr: string;
  };
  rawUrl: string;
}

export default function UPIResultCard({ data, rawUrl }: UPIResultCardProps) {
  const toast = useToast();
  const colors = useThemedColors();
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [apps, setApps] = useState<UPIApp[]>(() => getCachedUPIApps());
  const [loadingApps, setLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState<string | null>(null);

  const refreshApps = useCallback(() => {
    const controller =
      typeof AbortController !== "undefined"
        ? new AbortController()
        : undefined;

    setLoadingApps(true);
    setAppsError(null);

    fetchUPIApps({
      forceRefresh: true,
      signal: controller?.signal,
    })
      .then((list) => {
        const nextApps = list.length ? list : getCachedUPIApps();
        setApps(nextApps);
        setLoaded((prev) => {
          const nextState: Record<string, boolean> = {};
          nextApps.forEach((app) => {
            nextState[app.name] = prev[app.name] ?? false;
          });
          return nextState;
        });
      })
      .catch((error: unknown) => {
        if ((error as Error)?.name === "AbortError") {
          return;
        }
        const fallbackApps = getCachedUPIApps();
        setAppsError("Live UPI app list unavailable. Showing cached apps.");
        setApps(fallbackApps);
        setLoaded((prev) => {
          const nextState: Record<string, boolean> = {};
          fallbackApps.forEach((app) => {
            nextState[app.name] = prev[app.name] ?? false;
          });
          return nextState;
        });
      })
      .finally(() => {
        setLoadingApps(false);
      });

    return () => controller?.abort();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const abort = refreshApps();
      return () => abort?.();
    }, [refreshApps, rawUrl])
  );

  const handleOpenUPIApp = async (appName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await openUPIApp(rawUrl, appName, {
      params: {
        pa: data.pa,
        pn: data.pn,
        am: data.am,
        tn: data.tn,
        cu: data.cu,
        mc: data.mc,
        tr: data.tr,
      },
      preferNativeDeepLink: true,
      fallbackToStore: true,
    });
    if (!success) {
      toast.show({
        placement: "top",
        containerStyle: { margin: 16 },
        render: () => (
          <SafeAreaView edges={["bottom", "left", "right", "top"]}>
            <Box bg="$warning400" px="$4" py="$2" rounded="$md" hardShadow="5">
              <Text color="$white" fontWeight="$medium">
                Unable to open {appName}. Please make sure the app is installed.
              </Text>
            </Box>
          </SafeAreaView>
        ),
      });
    }
  };

  const labelColor = colors.infoLabel;
  const valueColor = colors.infoValue;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <MotiView
        from={{ opacity: 0, translateY: 32 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 440 }}
      >
        <FuturisticCard mt="$5" mb="$8">
          <VStack space="xl">
            <HStack alignItems="center" space="md">
              <Box
                width={64}
                height={64}
                borderRadius="$pill"
                alignItems="center"
                justifyContent="center"
                bg={colors.iconHaloPrimary}
              >
                <Icon as={CreditCardIcon} size="xl" color={colors.accentIcon} />
              </Box>
              <VStack space="xs">
                <Text
                  size="lg"
                  fontWeight="$bold"
                  color={colors.textAccentTitle}
                >
                  UPI Payment Request
                </Text>
                <Text size="xs" color={colors.textMuted}>
                  Tap an app below to complete the transfer instantly
                </Text>
              </VStack>
            </HStack>

            <VStack space="md">
              {appsError && (
                <Box
                  px="$3"
                  py="$2"
                  borderRadius="$lg"
                  bg={colors.surfaceDangerMuted}
                  borderWidth={1}
                  borderColor={colors.outlineDanger}
                >
                  <Text size="xs" color={colors.dangerIcon}>
                    {appsError}
                  </Text>
                </Box>
              )}
              {data.pn && (
                <InfoLine
                  label="Payee Name"
                  value={data.pn}
                  labelColor={labelColor}
                  valueColor={valueColor}
                />
              )}
              {data.pa && (
                <InfoLine
                  label="UPI ID"
                  value={data.pa}
                  labelColor={labelColor}
                  valueColor={valueColor}
                />
              )}
              {data.am && (
                <InfoLine
                  label="Amount"
                  value={formatAmount(data.am, data.cu)}
                  labelColor={labelColor}
                  valueColor={colors.valueHighlight}
                  valueSize="xl"
                />
              )}
              {data.tn && (
                <InfoLine
                  label="Note"
                  value={data.tn}
                  labelColor={labelColor}
                  valueColor={valueColor}
                />
              )}
              {data.mc && (
                <InfoLine
                  label="Merchant Code"
                  value={data.mc}
                  labelColor={labelColor}
                  valueColor={valueColor}
                />
              )}
              {data.tr && (
                <InfoLine
                  label="Transaction Ref"
                  value={data.tr}
                  labelColor={labelColor}
                  valueColor={valueColor}
                />
              )}
            </VStack>

            <Box
              borderWidth={1}
              borderColor={colors.outlineDivider}
              borderRadius="$3xl"
              opacity={0.6}
            />

            <VStack space="md">
              <Text
                size="sm"
                fontWeight="$semibold"
                color={colors.sectionTitle}
              >
                Pay using your preferred app
              </Text>

              <HStack
                flexWrap="wrap"
                justifyContent="space-between"
                alignContent="flex-start"
                rowGap="$3"
              >
                {apps.length > 0
                  ? apps.map((app, index) => {
                      const isLoaded = loaded[app.name];
                      return (
                        <MotiView
                          key={app.packageName ?? index}
                          from={{ opacity: 0, translateY: 16, scale: 0.96 }}
                          animate={{ opacity: 1, translateY: 0, scale: 1 }}
                          transition={{
                            type: "timing",
                            duration: 280,
                            delay: index * 60,
                          }}
                        >
                          <Pressable
                            onPress={() => handleOpenUPIApp(app.name)}
                            alignItems="center"
                            justifyContent="center"
                            w={104}
                            h={104}
                            borderRadius="$3xl"
                            borderWidth={1}
                            borderColor={colors.outlineTile}
                            bg={colors.surfaceAppTile}
                            shadowColor={colors.accentTileShadow}
                            shadowOffset={{ width: 0, height: 10 }}
                            shadowOpacity={0.12}
                            shadowRadius={16}
                            style={{ elevation: 8 }}
                            $pressed={{ opacity: 0.86 }}
                          >
                            <Box alignItems="center">
                              <Image
                                source={{ uri: app.icon }}
                                alt={app.name}
                                w={44}
                                h={44}
                                borderRadius={999}
                                mb="$2"
                                opacity={isLoaded ? 1 : 0}
                              />
                              {!isLoaded && (
                                <Box
                                  position="absolute"
                                  w={44}
                                  h={44}
                                  borderRadius={999}
                                  overflow="hidden"
                                >
                                  <MotiView
                                    from={{ translateX: "-100%" }}
                                    animate={{ translateX: "100%" }}
                                    transition={{
                                      loop: true,
                                      type: "timing",
                                      duration: 1000,
                                    }}
                                    style={{
                                      height: "100%",
                                      width: "60%",
                                      backgroundColor:
                                        colors.accentPrimary + "40",
                                    }}
                                  />
                                </Box>
                              )}
                              <Image
                                source={{ uri: app.icon }}
                                alt="preload"
                                w={1}
                                h={1}
                                opacity={0}
                                onLoad={() =>
                                  setLoaded((prev) => ({
                                    ...prev,
                                    [app.name]: true,
                                  }))
                                }
                              />
                            </Box>

                            <Text
                              size="xs"
                              fontWeight="$medium"
                              color={colors.valueSoft}
                              textAlign="center"
                            >
                              {app.name}
                            </Text>
                          </Pressable>
                        </MotiView>
                      );
                    })
                  : loadingApps && (
                      <>
                        {Array.from({ length: 9 }).map((_, index) => (
                          <MotiView
                            key={`placeholder-${index}`}
                            from={{ opacity: 0, translateY: 8 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{
                              type: "timing",
                              duration: 250,
                              delay: index * 70,
                            }}
                          >
                            <Box
                              w={104}
                              h={104}
                              borderRadius="$3xl"
                              bg={colors.surfaceAccent}
                              overflow="hidden"
                            >
                              <MotiView
                                from={{ translateX: "-100%" }}
                                animate={{ translateX: "100%" }}
                                transition={{
                                  loop: true,
                                  type: "timing",
                                  duration: 1200,
                                }}
                                style={{
                                  height: "100%",
                                  width: "60%",
                                  backgroundColor: colors.accentPrimary + "40",
                                }}
                              />
                            </Box>
                          </MotiView>
                        ))}
                      </>
                    )}

                {!loadingApps && apps.length === 0 && (
                  <Box
                    px="$3"
                    py="$4"
                    borderRadius="$2xl"
                    bg={colors.surfaceAccent}
                    borderWidth={1}
                    borderColor={colors.outlinePrimary}
                    alignItems="center"
                    w="100%"
                  >
                    <Text size="xs" color={colors.textMuted}>
                      No supported UPI apps detected right now.
                    </Text>
                  </Box>
                )}
              </HStack>
            </VStack>
          </VStack>
        </FuturisticCard>
      </MotiView>
    </ScrollView>
  );
}

function InfoLine({
  label,
  value,
  labelColor,
  valueColor,
  valueSize = "md",
}: {
  label: string;
  value?: string;
  labelColor: string;
  valueColor: string;
  valueSize?: "md" | "xl";
}) {
  if (!value) return null;
  return (
    <VStack space="xs">
      <Text size="xs" color={labelColor} fontWeight="$medium">
        {label}
      </Text>
      <Text size={valueSize} fontWeight="$semibold" color={valueColor}>
        {value}
      </Text>
    </VStack>
  );
}
