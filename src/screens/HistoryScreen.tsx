import FuturisticCard from "@/src/components/FuturisticCard";
import ThemeToggle from "@/src/components/ThemeToggle";
import { useScanStore } from "@/src/store/useScanStore";
import { QRType } from "@/src/utils/qrParser";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  ButtonText,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  useColorMode,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeftIcon, FolderOpenIcon, TrashIcon } from "lucide-react-native";
import { MotiView } from "moti";
import { useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemedColors } from "@/src/theme/colors";

export default function HistoryScreen() {
  const router = useRouter();
  const { scanHistory, clearHistory, removeFromHistory, setCurrentScan } =
    useScanStore();
  const colorMode = useColorMode();
  const isDark = colorMode === "dark";
  const statusBarStyle = isDark ? "light" : "dark";
  const colors = useThemedColors();

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleClearHistory = () => {
    setShowClearDialog(true);
  };

  const confirmClearHistory = () => {
    clearHistory();
    setShowClearDialog(false);
  };

  const handleItemPress = (item: any) => {
    setCurrentScan(item);
    router.push("/result");
  };

  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      removeFromHistory(itemToDelete);
      setItemToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  const getTypeColor = (type: QRType) => {
    const typeColors: Record<QRType, string> = {
      UPI: colors.typeUPI,
      URL: colors.typeURL,
      WIFI: colors.typeWIFI,
      VCARD: colors.typeVCARD,
      EMAIL: colors.typeEMAIL,
      PHONE: colors.typePHONE,
      TEXT: colors.typeFallback,
    };
    return typeColors[type] ?? colors.typeFallback;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  const getPreviewText = (item: any) => {
    const previews: Record<QRType, string> = {
      UPI: item.data.pn || item.data.pa || "UPI Payment",
      URL: item.data.url,
      WIFI: item.data.ssid || "Wi-Fi Network",
      VCARD: item.data.name || "Contact",
      EMAIL: item.data.email,
      PHONE: item.data.phone,
      TEXT: "",
    };
    return (
      previews[item.type as QRType] ??
      (item.data.text?.substring(0, 50) || "Text")
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 32 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 360, delay: index * 50 }}
      style={{ marginBottom: 16 }}
    >
      <Pressable
        onPress={() => handleItemPress(item)}
        accessibilityRole="button"
      >
        <FuturisticCard px="$5" py="$4">
          <HStack space="md" alignItems="center">
            <Box
              width={52}
              height={52}
              borderRadius="$pill"
              alignItems="center"
              justifyContent="center"
              bg={colors.iconHaloSecondary}
            >
              <Icon as={TrashIcon} size="lg" color={getTypeColor(item.type)} />
            </Box>

            <VStack flex={1} space="xs">
              <Text size="xs" fontWeight="$semibold" color={colors.textMuted}>
                {item.type}
              </Text>
              <Text
                size="sm"
                fontWeight="$medium"
                color={colors.textPrimaryStrong}
                numberOfLines={2}
              >
                {getPreviewText(item)}
              </Text>
              <Text size="xs" color={colors.textMutedLow}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </VStack>

            <Pressable
              onPress={() => handleDeleteItem(item.id)}
              accessibilityRole="button"
            >
              <Box
                width={40}
                height={40}
                borderRadius="$pill"
                alignItems="center"
                justifyContent="center"
                bg={colors.surfaceDangerMuted}
              >
                <Icon as={TrashIcon} size="md" color={colors.dangerIcon} />
              </Box>
            </Pressable>
          </HStack>
        </FuturisticCard>
      </Pressable>
    </MotiView>
  );

  const renderHeader = () => (
    <Box px={1} mb={4}>
      <Text size="xs" color={colors.textMutedSoft}>
        Swipe left or long press to manage entries.
      </Text>
    </Box>
  );

  return (
    <Box flex={1} bg={isDark ? "$surfaceDark900" : "$surfaceLight50"}>
      <StatusBar style={statusBarStyle} />
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
                  Scan History
                </Text>
                <Box
                  height={2}
                  width={48}
                  borderRadius={999}
                  bg={colors.gradientBar}
                />
              </VStack>

              <HStack space="sm" alignItems="center">
                <ThemeToggle />
                {scanHistory.length > 0 && (
                  <Pressable
                    onPress={handleClearHistory}
                    accessibilityRole="button"
                  >
                    <Box
                      width={44}
                      height={44}
                      borderRadius="$pill"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth={1}
                      borderColor={colors.outlineDanger}
                      bg={colors.surfaceDanger}
                    >
                      <Icon
                        as={TrashIcon}
                        size="md"
                        color={colors.dangerIcon}
                      />
                    </Box>
                  </Pressable>
                )}
              </HStack>
            </HStack>
          </MotiView>

          {scanHistory.length === 0 ? (
            <Box flex={1} alignItems="center" justifyContent="center" px="$6">
              <VStack space="md" alignItems="center">
                <Box
                  width={96}
                  height={96}
                  borderRadius={48}
                  alignItems="center"
                  justifyContent="center"
                  bg={colors.iconHaloSecondary}
                >
                  <Icon
                    as={FolderOpenIcon}
                    size="xl"
                    color={colors.accentIcon}
                  />
                </Box>
                <Text
                  size="lg"
                  fontWeight="$semibold"
                  color={colors.textPrimaryStrong}
                >
                  No scan history yet
                </Text>
                <Text
                  size="sm"
                  color={colors.textMutedSofter}
                  textAlign="center"
                >
                  Your scanned QR codes will appear here. Start scanning to
                  build your timeline.
                </Text>
              </VStack>
            </Box>
          ) : (
            <FlatList
              data={scanHistory}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 32,
              }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={renderHeader}
            />
          )}
        </Box>
      </SafeAreaView>

      {/* Clear History AlertDialog */}
      <AlertDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text size="lg" fontWeight="$semibold">
              Clear History
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              Are you sure you want to clear all scan history? This action
              cannot be undone.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setShowClearDialog(false)}
              mr="$3"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button action="negative" onPress={confirmClearHistory}>
              <ButtonText>Clear All</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Item AlertDialog */}
      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text size="lg" fontWeight="$semibold">
              Delete Item
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>Remove this item from history?</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setShowDeleteDialog(false)}
              mr="$3"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button action="negative" onPress={confirmDeleteItem}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
