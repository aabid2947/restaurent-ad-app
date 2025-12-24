

### **🔹 App Architecture & Kiosk Mode**

      Use a native module or existing libraries:

* `react-native-immersive`  
* `react-native-full-screen`

Both hide nav bars and keep video fullscreen.

*  **Pinned Mode (User-exit allowed)**.  
   Flow: app launches → user presses remote button combo → app becomes pinned → UI hidden, remote limited.  
* Kiosk-mode behavior depends heavily on the specific TV stick model and firmware, so it can only be partially implemented and will never behave uniformly across all devices.  
*  **Autostart:** Configure the app to start on boot by listening for BOOT\_COMPLETED intents, which is standard for digital signage kiosks to handle power cycles automatically.

### **🔹 Media Technology & Playback logic**

* **Video Playback:** Use react-native-video or expo-video for battle-tested fullscreen playback with hardware acceleration.  
* **Image Handling:** Implement react-native-fast-image to handle aggressive disk caching of restaurant promo images, ensuring instant loading without re-fetching.  
* **Customization Logic:** The player must parse individual timing metadata from the configuration (e.g., video\_duration\_override: 120). If a video is assigned specific playback minutes, the app should use the repeat property or a timed skip to manage exact durations.

### **🔹 User & Display Management Plan**

* **Device Context (Multiple TVs):** Each TV Stick is assigned a unique device\_token. The admin dashboard allows users to manage multiple tokens, assigning different playlist IDs to each stick independently.  
* **User Customization:** Each restaurant (User) has their own admin panel instance that interacts with the backend to upload assets.  
* **Offline Operation:** The app must verify local storage integrity. If a new playlist heartbeat fails, the app defaults to the last successfully cached playlist stored in the device's local cache directory.  
* **Admin Refresh:** admin panel se refresh ya restart, rest and force sync.

### **🔹 Required Backend APIs**

| Category | API Endpoint | Purpose |
| :---- | :---- | :---- |
| **Pairing** | POST /v1/displays/pair | Accepts 6-digit code from Stick; returns device\_token and user\_id. |
| **Config** | GET /v1/player/config | Fetches playlist JSON including file URLs, playback duration, and display sequence. |
| **Heartbeat** | POST /v1/player/heartbeat | Sends display status, app version, and timestamp to backend. |
| **Custom Upload** | POST /v1/admin/upload | (User-side) Uploads media assets to cloud storage; generates public URLs. |
| **Asset Sync** | GET /v1/admin/sync-status | (User-side) Monitors which TVs have successfully downloaded the latest assets. |

### **🔹 React Native Implementation Steps**

1. **Environment Setup:** Target SDK 28+ for Mi Sticks. Use the React Native for TV repository for specific directional control (D-pad) optimizations.  
2. **State Storage:** Use AsyncStorage to store the device token and the current active playlist metadata.  
3. **Background Cache:** Implement a background download task using react-native-fs to download media files silently. Only refresh the display playlist once all new assets are downloaded and verified against a checksum.  
4. **Admin UI:** Build a separate dashboard (web or mobile) that maps specific users to their devices. This panel allows the user to click on a device and select which uploaded video will be looped.

   **Monitoring System**

1. **Automated Screen Capture**  
   Implement periodic capture of the active screen using a view-capture module, triggered at fixed time intervals for all app screens.  
2. **Background Processing & Upload Queue**  
   Compress images, store them temporarily, and upload them through a reliable queue with retry handling and offline support.  
3. **Global Integration & Performance Control**  
   Add a root-level service that tracks the current screen, manages capture timing, and ensures captures run without degrading UI performance.

**Note: Any additional changes will result in a revised quotation for the project.**

       


