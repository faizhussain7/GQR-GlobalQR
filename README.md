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
- Dark & Light mode support
- Animated scanning frame with laser effect
- Haptic feedback on successful scans
- Gradient headers and card-based results

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

| Purpose | Library | Version |
|---------|---------|---------|
| Framework | React Native + Expo | 54.x |
| Navigation | Expo Router | 6.x |
| Camera | react-native-vision-camera | 4.x |
| QR Scanner | vision-camera-code-scanner | 0.2.x |
| Animations | Moti + Reanimated | 4.x |
| State | Zustand | 5.x |
| Storage | AsyncStorage | 2.x |
| Permissions | react-native-permissions | 5.x |
| Haptics | expo-haptics | 15.x |
| Language | TypeScript | 5.x |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- iOS: Xcode 14+ and CocoaPods
- Android: Android Studio and JDK 17

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd global-qr-scanner

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
global-qr-scanner/
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
│   │   └── GenericResultCard.tsx # Generic QR display
│   │
│   ├── screens/                 # Screen components
│   │   ├── ScannerScreen.tsx   # Main scanning interface
│   │   ├── ResultScreen.tsx    # Result display + actions
│   │   └── HistoryScreen.tsx   # Scan history list
│   │
│   ├── utils/                   # Utility functions
│   │   ├── qrParser.ts         # QR classification logic
│   │   └── upiHandler.ts       # UPI payment utilities
│   │
│   └── store/                   # State management
│       └── useScanStore.ts     # Zustand store
│
├── assets/                      # Images, icons, fonts
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── tsconfig.json               # TypeScript configuration
```

---

## 🎯 How It Works

### 1. **QR Code Scanning**
- Uses `react-native-vision-camera` for high-performance camera access
- `vision-camera-code-scanner` provides native QR decoding
- Frame processor optimized for real-time scanning

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
