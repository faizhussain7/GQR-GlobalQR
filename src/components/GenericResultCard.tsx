import FuturisticCard from "@/src/components/FuturisticCard";
import { useThemedColors } from "@/src/theme/colors";
import { QRType } from "@/src/utils/qrParser";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Icon,
  Text,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import {
  CheckCircleIcon,
  ClipboardIcon,
  FileTextIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
  ShareIcon,
  UserIcon,
  WifiIcon,
} from "lucide-react-native";
import { MotiView } from "moti";
import { Linking, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GenericResultCardProps {
  type: QRType;
  data: any;
  raw: string;
}

export default function GenericResultCard({
  type,
  data,
  raw,
}: GenericResultCardProps) {
  const toast = useToast();
  const colors = useThemedColors();

  const getIcon = () => {
    switch (type) {
      case "URL":
        return LinkIcon;
      case "WIFI":
        return WifiIcon;
      case "VCARD":
        return UserIcon;
      case "EMAIL":
        return MailIcon;
      case "PHONE":
        return PhoneIcon;
      default:
        return FileTextIcon;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "URL":
        return "Website Link";
      case "WIFI":
        return "Wi-Fi Network";
      case "VCARD":
        return "Contact Card";
      case "EMAIL":
        return "Email Address";
      case "PHONE":
        return "Phone Number";
      default:
        return "Text Content";
    }
  };

  const handleCopy = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(raw);
    toast.show({
      placement: "top",
      render: () => (
        <SafeAreaView edges={["bottom", "left", "right", "top"]}>
          <Box bg="$success400" px="$4" py="$2" rounded="$md" hardShadow="5">
            <Text color="$white" fontWeight="$medium">
              Content copied to clipboard
            </Text>
          </Box>
        </SafeAreaView>
      ),
    });
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({ message: raw });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handlePrimaryAction = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      switch (type) {
        case "URL": {
          const canOpen = await Linking.canOpenURL(data.url);
          if (canOpen) {
            await Linking.openURL(data.url);
          } else {
            toast.show({
              placement: "top",
              render: () => (
                <SafeAreaView edges={["bottom", "left", "right", "top"]}>
                  <Box
                    bg="$danger400"
                    px="$4"
                    py="$2"
                    rounded="$md"
                    hardShadow="5"
                  >
                    <Text color="$white" fontWeight="$medium">
                      Cannot open this URL
                    </Text>
                  </Box>
                </SafeAreaView>
              ),
            });
          }
          break;
        }
        case "EMAIL":
          await Linking.openURL(`mailto:${data.email}`);
          break;
        case "PHONE":
          await Linking.openURL(`tel:${data.phone}`);
          break;
        case "WIFI":
          try {
            await Linking.openSettings();
          } catch {
            toast.show({
              placement: "top",
              render: () => (
                <SafeAreaView edges={["bottom", "left", "right", "top"]}>
                  <Box
                    bg="$danger400"
                    px="$4"
                    py="$2"
                    rounded="$md"
                    hardShadow="5"
                  >
                    <Text color="$white" fontWeight="$medium">
                      Unable to connect to Wi‑Fi
                    </Text>
                  </Box>
                </SafeAreaView>
              ),
            });
          }
          break;
        case "VCARD":
          if (data.phone) {
            await Linking.openURL(`tel:${data.phone}`);
          } else {
            handleCopy();
          }
          break;
        default:
          handleCopy();
      }
    } catch (error) {
      console.error("Error handling primary action:", error);
      toast.show({
        placement: "top",
        render: () => (
          <SafeAreaView edges={["bottom", "left", "right", "top"]}>
            <Box bg="$danger400" px="$4" py="$2" rounded="$md" hardShadow="5">
              <Text color="$white" fontWeight="$medium">
                Unable to perform this action
              </Text>
            </Box>
          </SafeAreaView>
        ),
      });
    }
  };

  const getPrimaryActionLabel = () => {
    switch (type) {
      case "URL":
        return "Open Link";
      case "EMAIL":
        return "Send Email";
      case "PHONE":
        return "Call";
      case "WIFI":
        return "Connect to Network";
      case "VCARD":
        return data.phone ? "Call Contact" : "Copy Card";
      default:
        return "Copy";
    }
  };

  const renderContent = () => {
    const labelColor = colors.infoLabel;
    const valueColor = colors.infoValue;
    switch (type) {
      case "URL":
        return (
          <VStack space="xs">
            <Text size="xs" color={labelColor} fontWeight="$medium">
              URL
            </Text>
            <Text
              size="md"
              fontWeight="$semibold"
              color={valueColor}
              numberOfLines={3}
            >
              {data.url}
            </Text>
          </VStack>
        );
      case "WIFI":
        return (
          <VStack space="md">
            <InfoRow
              label="Network Name"
              value={data.ssid}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            <InfoRow
              label="Security"
              value={data.security}
              labelColor={labelColor}
              valueColor={valueColor}
            />
            {data.password ? (
              <InfoRow
                label="Password"
                value={data.password}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            ) : null}
          </VStack>
        );
      case "VCARD":
        return (
          <VStack space="md">
            {data.name ? (
              <InfoRow
                label="Name"
                value={data.name}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            ) : null}
            {data.phone ? (
              <InfoRow
                label="Phone"
                value={data.phone}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            ) : null}
            {data.email ? (
              <InfoRow
                label="Email"
                value={data.email}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            ) : null}
            {data.organization ? (
              <InfoRow
                label="Organization"
                value={data.organization}
                labelColor={labelColor}
                valueColor={valueColor}
              />
            ) : null}
          </VStack>
        );
      case "EMAIL":
        return (
          <InfoRow
            label="Email"
            value={data.email}
            labelColor={labelColor}
            valueColor={valueColor}
          />
        );
      case "PHONE":
        return (
          <InfoRow
            label="Phone Number"
            value={data.phone}
            labelColor={labelColor}
            valueColor={valueColor}
          />
        );
      default:
        return (
          <VStack space="xs">
            <Text size="xs" color={labelColor} fontWeight="$medium">
              Content
            </Text>
            <Text size="md" fontWeight="$semibold" color={valueColor}>
              {data.text}
            </Text>
          </VStack>
        );
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 420 }}
    >
      <FuturisticCard mt="$5">
        <VStack space="xl">
          <HStack space="md" alignItems="center">
            <Box
              width={64}
              height={64}
              borderRadius="$pill"
              alignItems="center"
              justifyContent="center"
              bg={colors.iconHaloPrimary}
            >
              <Icon as={getIcon()} size="xl" color={colors.accentIcon} />
            </Box>
            <VStack flex={1} space="xs">
              <Text size="lg" fontWeight="$bold" color={colors.textAccentTitle}>
                {getTitle()}
              </Text>
              <Text size="xs" color={colors.textMuted}>
                {type} payload detected
              </Text>
            </VStack>
          </HStack>
          {renderContent()}
          <VStack space="md">
            <Button onPress={handlePrimaryAction} variant="solid">
              <ButtonIcon as={CheckCircleIcon} mr="$2" />
              <ButtonText>{getPrimaryActionLabel()}</ButtonText>
            </Button>
            <HStack space="md">
              <Button
                flex={1}
                variant="outline"
                borderColor={colors.outlinePrimary}
                onPress={handleCopy}
              >
                <ButtonIcon
                  as={ClipboardIcon}
                  mr="$1"
                  color={colors.accentIcon}
                />
                <ButtonText color={colors.textHighlight}>Copy</ButtonText>
              </Button>
              <Button
                flex={1}
                variant="outline"
                borderColor={colors.outlineSecondary}
                onPress={handleShare}
              >
                <ButtonIcon as={ShareIcon} mr="$1" color={colors.shareIcon} />
                <ButtonText color={colors.shareText}>Share</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </FuturisticCard>
    </MotiView>
  );
}

function InfoRow({
  label,
  value,
  labelColor,
  valueColor,
}: {
  label: string;
  value?: string;
  labelColor: string;
  valueColor: string;
}) {
  if (!value) return null;
  return (
    <VStack space="xs">
      <Text size="xs" color={labelColor} fontWeight="$medium">
        {label}
      </Text>
      <Text size="md" fontWeight="$semibold" color={valueColor}>
        {value}
      </Text>
    </VStack>
  );
}
