import { useThemedColors } from "@/src/theme/colors";
import {
  Box,
  Center,
  Pressable,
  Text,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import * as Haptics from "expo-haptics";
import {
  Camera as CameraIcon,
  Flashlight,
  FlashlightOff,
} from "lucide-react-native";
import { MotiView } from "moti";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

interface QRScannerViewProps {
  onCodeScanned: (code: string) => void;
  isActive: boolean;
}

export default function QRScannerView({
  onCodeScanned,
  isActive,
}: QRScannerViewProps) {
  const toast = useToast();
  const [hasPermission, setHasPermission] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0);
  const colors = useThemedColors();

  const palette = useMemo(
    () => ({
      background: colors.appBackground,
      overlay: colors.modalOverlay,
      accent: colors.accentPrimary,
      neon: colors.accentSecondary,
      scanLine: colors.accentScanLine,
      torchBg: colors.torchBackground,
      torchBorder: colors.torchBorder,
      torchGlow: colors.torchButtonShadow,
      textPrimary: colors.textPrimary,
      textSecondary: colors.textSecondary,
      halo: colors.haloCamera,
    }),
    [colors]
  );

  const { hasPermission: hasCamPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  useEffect(() => {
    setHasPermission(hasCamPermission);
    if (!hasCamPermission) {
      toast.show({
        placement: "top",
        render: () => (
          <SafeAreaView edges={["bottom", "left", "right", "top"]}>
            <Box bg="$warning400" px="$4" py="$2" rounded="$md" hardShadow="5">
              <Text color="$white" fontWeight="$medium">
                Camera permission required to scan QR codes
              </Text>
            </Box>
          </SafeAreaView>
        ),
      });
    }
  }, [hasCamPermission]);

  const handlePermissionRequest = async () => {
    const status = await Camera.requestCameraPermission();
    if (status === "granted") {
      setHasPermission(true);
      setPermissionDeniedCount(0);
    } else {
      setHasPermission(false);
      setPermissionDeniedCount((prev) => prev + 1);
      if (permissionDeniedCount >= 2) {
        toast.show({
          placement: "top",
          render: () => (
            <SafeAreaView edges={["bottom", "left", "right", "top"]}>
              <Box
                bg="$warning600"
                px="$4"
                py="$2"
                rounded="$md"
                hardShadow="5"
              >
                <Text color="$white" fontWeight="$semibold">
                  Permission denied multiple times. Please enable camera access
                  from app settings.
                </Text>
              </Box>
            </SafeAreaView>
          ),
        });
      }
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      if (!isActive || codes.length === 0) return;
      const code = codes[0];
      if (code.value && code.value !== lastScannedCode) {
        setLastScannedCode(code.value);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onCodeScanned(code.value);
      }
    },
  });

  const toggleTorch = () => {
    setTorchEnabled((prev) => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!hasPermission) {
    return (
      <Center flex={1} bg={colors.surfaceCard} p="$6">
        <VStack space="lg" alignItems="center">
          <Box
            width={96}
            height={96}
            borderRadius={48}
            alignItems="center"
            justifyContent="center"
            bg={palette.halo}
          >
            <CameraIcon size={48} color={palette.accent} />
          </Box>
          <VStack space="md" alignItems="center">
            <Text
              color={palette.textPrimary}
              size="lg"
              fontWeight="$semibold"
              textAlign="center"
            >
              Camera permission required
            </Text>
            <Text color={palette.textSecondary} size="sm" textAlign="center">
              We need access to your camera to scan QR codes securely.
            </Text>
          </VStack>
          <Pressable
            onPress={handlePermissionRequest}
            accessibilityRole="button"
          >
            <Box bg="$brandPrimary600" px="$6" py="$3" borderRadius="$pill">
              <Text color="$white" fontWeight="$semibold">
                Grant Permission
              </Text>
            </Box>
          </Pressable>
        </VStack>
      </Center>
    );
  }

  if (!device) {
    return (
      <Center flex={1} bg={colors.surfaceCard}>
        <Text color={palette.textPrimary} size="md" textAlign="center">
          No camera device found
        </Text>
      </Center>
    );
  }

  return (
    <Box flex={1}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
        torch={torchEnabled ? "on" : "off"}
        enableZoomGesture
        focusable
        photo={false}
        video={false}
      />
      <Box style={styles.overlay}>
        <Box
          style={[
            styles.unfocusedContainer,
            { backgroundColor: palette.overlay },
          ]}
        />
        <Box style={styles.middleContainer}>
          <Box
            style={[
              styles.unfocusedContainer,
              { backgroundColor: palette.overlay },
            ]}
          />
          <Box
            style={[styles.focusedContainer, { borderColor: palette.accent }]}
          >
            <MotiView
              from={{ opacity: 0.35, scale: 0.94 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ type: "timing", duration: 1400, loop: true }}
              style={[styles.scannerBorder, { borderColor: palette.accent }]}
            >
              <Box
                style={[
                  styles.corner,
                  styles.topLeft,
                  { borderColor: palette.neon },
                ]}
              />
              <Box
                style={[
                  styles.corner,
                  styles.topRight,
                  { borderColor: palette.neon },
                ]}
              />
              <Box
                style={[
                  styles.corner,
                  styles.bottomLeft,
                  { borderColor: palette.neon },
                ]}
              />
              <Box
                style={[
                  styles.corner,
                  styles.bottomRight,
                  { borderColor: palette.neon },
                ]}
              />
            </MotiView>
            <MotiView
              from={{ translateY: -100, opacity: 0 }}
              animate={{ translateY: 100, opacity: 1 }}
              transition={{ type: "timing", duration: 2200, loop: true }}
              style={[styles.scanLine, { backgroundColor: palette.scanLine }]}
            />
          </Box>
          <Box
            style={[
              styles.unfocusedContainer,
              { backgroundColor: palette.overlay },
            ]}
          />
        </Box>
        <Box
          style={[
            styles.unfocusedContainer,
            { backgroundColor: palette.overlay },
          ]}
        />
      </Box>
      <Pressable
        style={[
          styles.torchButton,
          {
            backgroundColor: palette.torchBg,
            borderColor: palette.torchBorder,
            shadowColor: palette.torchGlow,
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
            elevation: 20,
            marginVertical: 16,
          },
        ]}
        onPress={toggleTorch}
        accessibilityRole="button"
        accessibilityLabel={torchEnabled ? "Disable torch" : "Enable torch"}
      >
        {torchEnabled ? (
          <Flashlight size={26} color={palette.neon} />
        ) : (
          <FlashlightOff size={26} color={palette.neon} />
        )}
      </Pressable>
    </Box>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  unfocusedContainer: {
    flex: 1,
  },
  middleContainer: {
    flexDirection: "row",
  },
  focusedContainer: {
    width: 260,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  scannerBorder: {
    width: 260,
    height: 260,
    position: "absolute",
    borderRadius: 32,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 32,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 32,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 32,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 32,
  },
  scanLine: {
    width: "100%",
    height: 2.5,
    opacity: 0.85,
  },
  torchButton: {
    position: "absolute",
    top: 120,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
});
