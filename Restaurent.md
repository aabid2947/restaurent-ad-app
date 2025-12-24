## **⚛️ Implementation Models**

These models represent the core data structures used within the application and backend.

### **1\. Device/Display Model (TV Stick)**

Represents a single TV stick installed at a restaurant.

| Field | Type | Description |
| :---- | :---- | :---- |
| device\_token | String | **Unique ID** assigned after pairing. Stored in AsyncStorage111.  |
| user\_id | String | ID of the restaurant/user who owns this device2.  |
| pairing\_code | String | The 6-digit code used for the initial pairing3.  |
| playlist\_id | String | The ID of the currently assigned playlist for this display4.  |
| app\_version | String | The version of the app running on the stick5.  |

### **2\. Playlist Configuration Model**

Represents the fetched configuration that dictates what media to play and when.

| Field | Type | Description |
| :---- | :---- | :---- |
| playlist\_id | String | Unique ID for the playlist6.  |
| display\_sequence | Array of Assets | The ordered list of assets to be played7.  |
| last\_updated | Timestamp | Used to verify if local storage is up-to-date (part of heartbeat/sync)8.  |

### **3\. Media Asset Model (within Playlist)**

Represents an individual video or image within a playlist sequence.

| Field | Type | Description |
| :---- | :---- | :---- |
| asset\_id | String | Unique ID for the media file. |
| file\_url | String | Public URL to the media asset in cloud storage9.  |
| type | Enum (video, image) | Media type. |
| playback\_duration | Integer | The exact duration in seconds to play the asset101010.  |
| checksum | String | Used to verify the integrity of the downloaded file11.  |

## ---

**🛠️ API Endpoint Models**

These models detail the necessary input (Request Body) and output (Response Body) for each required API endpoint.

### **1\. Pairing: POST /v1/displays/pair**

| Field | Location | Purpose |
| :---- | :---- | :---- |
| **Request Body** |  | Accepts the temporary code from the stick. |
| pairing\_code | Input | The 6-digit code entered on the stick12.  |
| **Response Body** |  | Returns device identifiers upon successful pairing. |
| device\_token | Output | The permanent unique ID for the stick13.  |
| user\_id | Output | The ID of the restaurant/user14.  |

### **2\. Config: GET /v1/player/config**

| Field | Location | Purpose |
| :---- | :---- | :---- |
| **Request Parameters** |  | Identifies the display requesting its configuration. |
| device\_token | Input | Used to identify the specific display15.  |
| **Response Body** |  | Returns the active playlist configuration. |
| playlist\_json | Output | JSON containing file URLs, playback duration, and sequence (The **Playlist Configuration Model**)16.  |

### **3\. Heartbeat: POST /v1/player/heartbeat**

| Field | Location | Purpose |
| :---- | :---- | :---- |
| **Request Body** |  | Sends status information back to the server. |
| device\_token | Input | The unique ID of the device17.  |
| status | Input | E.g., playing, idle, error18.  |
| app\_version | Input | Current software version19.  |
| timestamp | Input | Time of the status update20.  |
| **Response Body** |  | Simple confirmation (e.g., { "success": true }). |

### **4\. Custom Upload: POST /v1/admin/upload (User-Side)**

| Field | Location | Purpose |
| :---- | :---- | :---- |
| **Request Body** |  | Sends the media file and metadata for cloud storage. |
| media\_file | Input | The actual file data (e.g., video, image)21.  |
| user\_id | Input | Identifies the restaurant uploading the asset22.  |
| **Response Body** |  | Provides confirmation and the public access information. |
| file\_url | Output | The public URL generated for the uploaded asset23.  |

### **5\. Asset Sync: GET /v1/admin/sync-status (User-Side)**

| Field | Location | Purpose |
| :---- | :---- | :---- |
| **Request Parameters** |  | Identifies the restaurant and the playlist they are tracking. |
| user\_id | Input | Identifies the restaurant/user24.  |
| playlist\_id | Input | The ID of the playlist whose sync status is being checked25.  |
| **Response Body** |  | Returns the status of asset download on each display. |
| devices | Output | Array listing devices and their sync status. |
| device\_token | (In array) | The ID of the display26.  |
| download\_status | (In array) | E.g., completed, in\_progress, failed27.  |

Would you like a brief explanation of how these models connect in the overall application flow?