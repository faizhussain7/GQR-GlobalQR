# 🚀 Global Smart QR Scanner

<div align="center">

A **next-generation global QR scanner app** built with **React Native (Expo)** and **react-native-vision-camera** that can detect and intelligently handle **any QR code worldwide**.

[![Expo](https://img.shields.io/badge/Expo-54-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)

</div>

---

## ✨ Features

### 🎯 Universal QR Code Support
- **UPI Payments** (India) - Google Pay, PhonePe, Paytm, BHIM, etc.
- **URLs** - Automatically open web links
- **WiFi Networks** - View network credentials
- **vCards** - Contact information
- **Email & Phone** - Direct communication actions
- **Plain Text** - Copy and share any text

### 🎨 Beautiful UI/UX
- Modern, minimal design with smooth animations
- Built with Gluestack UI component library
- Dark & Light mode support with theme toggle
- Animated scanning frame with laser effect
- Haptic feedback on successful scans
- Gradient headers and card-based results
- Lucide icons for consistent iconography

### 📱 Smart Features
- **Intelligent Classification** - Automatically detect QR type
- **Scan History** - Keep track of all scans (up to 100 items)
- **Quick Actions** - Copy, Share, Open based on content type
- **Offline-First** - No network required for scanning
- **Permission Handling** - Graceful camera permission requests

### ⚡ Performance
- Fast native QR decoding
- Optimized frame processing
- Debounced scan detection (prevents duplicates)
- High FPS camera preview

---

## 📦 Tech Stack

### Core Framework
| Purpose | Library | Version |
|---------|---------|---------|
| Framework | React Native + Expo | 54.0.22 |
| React | React | 19.1.0 |
| Language | TypeScript | 5.9.2 |

### Navigation & Routing
| Purpose | Library | Version |
|---------|---------|---------|
| File-based Routing | Expo Router | 6.0.14 |
| Navigation | React Navigation | 7.x |
| Bottom Tabs | @react-navigation/bottom-tabs | 7.4.0 |

### Camera & QR Scanning
| Purpose | Library | Version |
|---------|---------|---------|
| Camera | react-native-vision-camera | 4.7.2 |
| Worklets | react-native-worklets-core | 1.6.2 |
| Worklets Support | react-native-worklets | 0.5.1 |

### UI & Styling
| Purpose | Library | Version |
|---------|---------|---------|
| UI Components | @gluestack-ui/themed | 1.1.64 |
| UI Config | @gluestack-ui/config | 1.1.20 |
| Icons | lucide-react-native | 0.552.0 |
| Vector Icons | @expo/vector-icons | 15.0.3 |
| Gradients | expo-linear-gradient | 15.0.7 |
| SVG | react-native-svg | 15.12.1 |
| Images | expo-image | 3.0.10 |

### Animations & Gestures
| Purpose | Library | Version |
|---------|---------|---------|
| Animations | Moti | 0.29.0 |
| Animations | react-native-reanimated | 4.1.1 |
| Gestures | react-native-gesture-handler | 2.28.0 |

### State & Storage
| Purpose | Library | Version |
|---------|---------|---------|
| State Management | Zustand | 5.0.2 |
| Local Storage | @react-native-async-storage/async-storage | 2.2.0 |

### Expo Modules
| Purpose | Library | Version |
|---------|---------|---------|
| Clipboard | expo-clipboard | 8.0.7 |
| Linking | expo-linking | 8.0.8 |
| Web Browser | expo-web-browser | 15.0.9 |
| Intent Launcher | expo-intent-launcher | 13.0.7 |
| Haptics | expo-haptics | 15.0.7 |
| Constants | expo-constants | 18.0.10 |
| Fonts | expo-font | 14.0.9 |
| Splash Screen | expo-splash-screen | 31.0.10 |
| Status Bar | expo-status-bar | 3.0.8 |
| Symbols | expo-symbols | 1.0.7 |
| System UI | expo-system-ui | 6.0.8 |

### Platform Support
| Purpose | Library | Version |
|---------|---------|---------|
| Safe Areas | react-native-safe-area-context | 5.6.0 |
| Screens | react-native-screens | 4.16.0 |
| Web Support | react-native-web | 0.21.0 |

### Development Tools
| Purpose | Library | Version |
|---------|---------|---------|
| Linting | ESLint | 9.25.0 |
| ESLint Config | eslint-config-expo | 10.0.0 |
| Type Definitions | @types/react | 19.1.0 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- iOS: Xcode 14+ and CocoaPods
- Android: Android Studio and JDK 17

### Installation

```bash
# Clone the repository
git clone https://github.com/faizhussain7/GQR---GlobalQR.git
cd GQR---GlobalQR

# Install dependencies
npm install
# or
yarn install
# or
bun install

# Prebuild native projects (required for camera)
npx expo prebuild

# For iOS only - Install pods
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

> **Note:** This app requires a development build or production build. It will **NOT** work with Expo Go due to native camera dependencies.

---

## 📂 Project Structure

```
GQR---GlobalQR/
├── app/                          # Expo Router (file-based routing)
│   ├── index.tsx                # Main scanner screen
│   ├── result.tsx               # Scan result screen
│   ├── history.tsx              # Scan history screen
│   └── _layout.tsx              # Root navigation layout
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── QRScannerView.tsx   # Camera + scanner component
│   │   ├── UPIResultCard.tsx   # UPI payment display
│   │   ├── GenericResultCard.tsx # Generic QR display
│   │   ├── FuturisticBackground.tsx # Background component
│   │   ├── FuturisticCard.tsx  # Card component
│   │   └── ThemeToggle.tsx     # Theme switcher
│   │
│   ├── screens/                 # Screen components
│   │   ├── ScannerScreen.tsx   # Main scanning interface
│   │   ├── ResultScreen.tsx    # Result display + actions
│   │   └── HistoryScreen.tsx   # Scan history list
│   │
│   ├── utils/                   # Utility functions
│   │   ├── qrParser.ts         # QR classification logic
│   │   ├── upiHandler.ts       # UPI payment utilities
│   │   ├── upi-apps.json       # UPI apps configuration
│   │   └── scrapeUpiApps.js   # UPI apps scraper
│   │
│   ├── store/                   # State management
│   │   └── useScanStore.ts     # Zustand store
│   │
│   └── theme/                   # Theme configuration
│       ├── colorModeManager.tsx # Color mode manager
│       └── colors.ts           # Color definitions
│
├── assets/                      # Images, icons, fonts
│   └── images/                  # App icons and images
├── android/                     # Android native project
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── gluestack-ui.config.ts      # Gluestack UI config
└── README.md                    # This file
```

---

## 🎯 How It Works

### 1. **QR Code Scanning**
- Uses `react-native-vision-camera` for high-performance camera access
- Native QR decoding with optimized frame processing
- Worklets support via `react-native-worklets-core` for real-time scanning
- High FPS camera preview with debounced scan detection

### 2. **Intelligent Classification**
The app automatically detects QR types:

```typescript
parseQRCodeContent(content: string) => {
  if (starts with "upi://pay?") → UPI Payment
  else if (starts with "http://") → URL
  else if (starts with "WIFI:") → WiFi Network
  else if (starts with "BEGIN:VCARD") → Contact Card
  else if (starts with "mailto:") → Email
  else if (starts with "tel:") → Phone
  else → Plain Text
}
```

### 3. **UPI Payment Handling**
- Parses UPI parameters: `pa`, `pn`, `am`, `tn`, `cu`
- Shows payment details in a beautiful card
- Provides quick-action buttons for popular UPI apps
- Deep links into payment apps using `upi://` scheme

### 4. **Scan History**
- Automatically saves all scans to AsyncStorage
- Prevents duplicate entries within 5 seconds
- Maintains last 100 scans
- Allows individual deletion and bulk clear

---

## 🔧 Configuration

### Camera Permissions

**iOS** - Configured in `app.json`:
```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "This app needs access to your camera to scan QR codes."
    }
  }
}
```

**Android** - Configured in `app.json`:
```json
{
  "android": {
    "permissions": ["CAMERA"]
  }
}
```

### Customize QR Types

Edit `src/utils/qrParser.ts` to add new QR formats or modify parsing logic.

### Customize UPI Apps

Edit `src/utils/upiHandler.ts` to add/remove payment apps from the suggestion list.

---

## 📱 Screenshots & Demo

### Scanner Screen
- Real-time camera preview
- Animated scanning frame
- Torch toggle
- History button

### Result Screen
- Type-specific result cards
- Context-aware actions
- Copy, Share, Open options
- Scan again button

### History Screen
- Chronological scan list
- Type indicators with icons
- Quick re-scan from history
- Individual & bulk delete

---

## 🚢 Building for Production

### Using EAS Build

```bash
# Configure EAS
npm install -g eas-cli
eas login

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Local Builds

```bash
# Android APK
cd android && ./gradlew assembleRelease

# iOS Archive (requires Mac)
cd ios && xcodebuild -workspace *.xcworkspace -scheme YourApp archive
```

---

## 🐛 Troubleshooting

### Camera Not Working
- ✅ Make sure you've run `npx expo prebuild`
- ✅ Check camera permissions in device settings
- ✅ Don't use Expo Go (use development build)

### Build Errors
- ✅ Clear cache: `npx expo start -c`
- ✅ Reinstall modules: `rm -rf node_modules && npm install`
- ✅ Clean native builds: `cd android && ./gradlew clean`

### Vision Camera Issues
- ✅ Ensure you're on React Native 0.81+
- ✅ Check that Reanimated is properly configured
- ✅ Verify worklets are enabled

---

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed installation instructions
- [Expo Docs](https://docs.expo.dev)
- [Vision Camera Docs](https://react-native-vision-camera.com)
- [Expo Router Docs](https://docs.expo.dev/router/introduction)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera) by Marc Rousavy
- [Expo](https://expo.dev) team for the amazing framework
- [Moti](https://moti.fyi) for beautiful animations
- [Zustand](https://github.com/pmndrs/zustand) for simple state management

---

<div align="center">

**Built with ❤️ using React Native and Expo**

⭐ Star this repo if you find it helpful!

</div>
