## 🚀 **ULTIMATE PROMPT — Global Smart QR Scanner (React Native + Expo + Vision Camera, 2025 Stack)**

> **Goal:**
> Build a **next-gen global QR scanner app** using **React Native (Expo SDK 51+)** and **react-native-vision-camera** that can detect **any QR code worldwide** — including **UPI payment QRs**, **URLs**, **text**, **Wi-Fi**, **vCards**, etc.
>
> The app should classify, parse, and display relevant actions based on the scanned content.
>
> If it’s a **UPI QR**, show UPI details and suggest opening payment apps like **Google Pay, PhonePe, Paytm, BHIM**, etc.
>
> If it’s any other QR, intelligently detect its type and show actions like **“Open Link,” “Copy Text,” “Share,” “Save Contact,” “Join WiFi,”** etc.

---

### 🧠 **Core Features**

1. **QR Scanning**

   - Use **`react-native-vision-camera` (latest stable version)** for the camera preview.
   - Integrate **`vision-camera-code-scanner`** for fast and accurate QR decoding.
   - Include a **laser scan animation overlay** or **animated border** (using **Reanimated + Moti**).
   - Show **torch toggle** & handle camera permissions gracefully.

2. **QR Classification Logic**

   - If starts with `upi://pay?`, classify as **UPI Payment QR**
   - Else if it’s a **URL**, **Wi-Fi**, **vCard**, or **Text**, detect accordingly using regex + parsing utils.
   - Create a modular utility: `parseQRCodeContent(content: string)` → returns `{ type, data }`

3. **UPI Handling**

   - Parse parameters: `pa`, `pn`, `am`, `tn`, `cu`, etc.
   - Show UPI info in a neat card (Payee Name, Amount, Notes).
   - Suggest popular UPI apps with clickable buttons (deep link into `upi://` intent).
   - Example: open via `Linking.openURL('upi://pay?...')`

4. **UI / UX**

   - Framework: **Expo + React Native + TypeScript**
   - Design system: **shadcn/ui (React Native port)** or **react-native-paper**
   - Theming: **Dark & Light mode**, with dynamic colors via **`react-native-dynamic-color`**
   - Layout: Gradient header, minimal camera overlay, haptic feedback on success
   - Smooth transitions between “Scanner → Result” screens using **React Navigation + Reanimated**
   - Modern minimal “card-based” result screen with motion animations (Moti)

5. **Architecture**

   - Navigation: **Expo Router v3**
   - State management: **Zustand** (lightweight global store)
   - Folder structure:

     ```
     src/
       ├─ screens/
       │   ├─ ScannerScreen.tsx
       │   ├─ ResultScreen.tsx
       ├─ components/
       │   ├─ QRScannerView.tsx
       │   ├─ UPIResultCard.tsx
       │   ├─ GenericResultCard.tsx
       ├─ utils/
       │   ├─ qrParser.ts
       │   ├─ upiHandler.ts
       ├─ store/
       │   └─ useScanStore.ts
     ```

6. **Extra Enhancements**

   - **Scan History** using `AsyncStorage`
   - **Share** & **Copy** buttons for each result
   - **Internationalization-ready (i18n)**
   - **Offline-friendly** (no network dependency for QR decoding)
   - **Permission Handling:** graceful onboarding (camera access explanation)
   - **Haptic Feedback:** on successful scan (`expo-haptics`)

7. **Performance**

   - Lazy-load camera
   - Debounce repeated scans
   - Frame processor optimization using `useFrameProcessor` from Vision Camera
   - Ensure high FPS scanning on both Android & iOS

8. **Testing & Production**

   - Jest + React Native Testing Library setup
   - Type-safe hooks and components
   - Android/iOS permissions handled correctly (Info.plist & AndroidManifest)
   - Optimized build for production (EAS Build ready)

---

### 💎 **Deliverables**

- Fully working Expo project
- Clean, modular, and typed codebase
- Beautiful, animated UI with smooth UX
- UPI QR detection & open-app suggestion
- Generic QR parsing (URLs, text, Wi-Fi, etc.)
- History + Share + Copy features
- Ready for production on both Android & iOS

---

### 🧩 **Tech Stack Summary (2025 Recommended Versions)**

| Purpose     | Library                                     | Notes                    |
| ----------- | ------------------------------------------- | ------------------------ |
| Camera      | `react-native-vision-camera`                | Latest stable            |
| QR Decode   | `vision-camera-code-scanner`                | Fast native decoding     |
| Animations  | `moti` + `react-native-reanimated           | Modern motion            |
| UI          | `gluestack ui                               | Trendy design            |
| Navigation  | `expo-router                                | File-based navigation    |
| State Mgmt  | `zustand`                                   | Lightweight global store |
| Storage     | `@react-native-async-storage/async-storage` | Save history             |
| Permissions | `react native permissions`                  | For camera & torch       |
| Haptics     | `expo-haptics`                              | Vibrate on scan          |
| Parsing     | Custom util functions                       | For UPI, URL, etc.       |

---

### ⚙️ **Bonus: Example Flow**

1. User opens app → camera permission screen → scanner loads
2. QR detected → laser flashes → haptic feedback → navigate to ResultScreen
3. If UPI QR → show UPI info with “Pay using” buttons
4. If other QR → detect type (URL/Text/Wi-Fi) → show action buttons
5. User can copy/share/save
6. “Scan Again” button brings back camera
