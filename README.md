# ChatX Mobile App

The mobile client for the ChatX real-time messaging platform. Built elegantly with React Native, Expo, and NativeWind (Tailwind CSS) for a premium, fast, and feature-rich user experience. State management and API data fetching are powerfully handled via unified Redux Toolkit Query (RTK Query) architectures.

## ✨ Features

- **Authentication:** Login, Register, Logout functionality locally managed securely via async storage.
- **Real-Time Messaging:** Instant, bi-directional chatting powered by Socket.IO.
- **Group Management:** Native screens to create groups, securely rename them, and selectively pull in participants if you are the Admin.
- **Read Receipts:** Visual blue double-ticks automatically reflecting message read statuses.
- **User Discovery:** A horizontal list algorithmically suggesting active users to immediately commence direct chatting with.
- **Profile Customization:** Ability to quickly modify passwords, avatars, and general profiles natively.

## 🛠️ Built With

- **Framework:** React Native & Expo
- **Routing:** React Navigation (Stack & Bottom Tabs)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State & Data Fetching:** Redux Toolkit & RTK Query
- **Sockets:** `socket.io-client`

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator set up, or the Expo Go app installed on your physical device.

### 🔗 Backend Dependency
**CRITICAL:** This mobile application requires the [ChatX Backend](https://github.com/SuayipEmre/chatX-backend) to be running simultaneously to function properly. 
Please ensure you have cloned, configured, and started the backend repository on port `8080` before launching this mobile app.

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the single required environment variable to connect the app to your backend API.

```env
# Your backend API URL (e.g., http://localhost:8080 or https://your-production-url.com)
EXPO_PUBLIC_API_URL=http://localhost:8080
```

*Note: When testing on a physical Android device against a local backend, use your computer's local IP address instead of `localhost` (e.g., `http://192.168.1.X:8080`).*

## 🚀 Getting Started

1. **Start the Backend:**
   Ensure your backend server is running (`npm run dev` in the backend repo).

2. **Install Mobile Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Metro Bundler:**
   ```bash
   npm run start
   ```
