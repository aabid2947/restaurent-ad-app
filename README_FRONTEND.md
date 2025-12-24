# Restaurant Digital Signage App

This is a React Native application for managing and displaying digital signage content on TV sticks.

## Features

- **Role Selection:** Choose between "Display Mode" (for TV sticks) and "Admin Mode" (for management).
- **Display Mode:**
  - Generates a pairing code.
  - Plays assigned playlists (Video & Image support).
  - Sends heartbeats to the backend.
- **Admin Mode:**
  - Login with User ID.
  - Dashboard to manage devices and content.
  - Pair new devices using the code displayed on the TV.
  - Create playlists and upload media (UI placeholders).

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler
    npm install @react-native-async-storage/async-storage
    npm install axios
    npm install lucide-react-native react-native-svg
    npm install react-native-video react-native-fast-image
    ```

2.  **Configure Backend:**
    - Open `src/config.ts`.
    - Update `API_BASE_URL` to point to your backend server.

3.  **Run the App:**
    - Android: `npm run android`
    - iOS: `npm run ios`

## Folder Structure

- `src/api`: API client and endpoint definitions.
- `src/components`: Reusable UI components.
- `src/context`: Global state management (User, Device Token, Mode).
- `src/navigation`: Navigation setup (Stack Navigator).
- `src/screens`: Application screens (Admin & Display).
- `src/theme`: Color palette and typography.
- `src/types`: TypeScript interfaces for models.
