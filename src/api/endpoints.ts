import apiClient from './client';
import {
  Device,
  PairingResponse,
  ConfigResponse,
  UploadResponse,
  SyncStatusResponse,
  Playlist,
  AuthRequest,
  AuthResponse,
  UploadSignatureResponse,
  SaveMediaRequest,
  SaveMediaResponse,
} from '../types';

// Auth Endpoints
export const registerUser = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/users/register', data);
  // console.log(response.data);
  // console.log(response)
  return response.data;
};

export const loginUser = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/v1/users/login', data);
  return response.data;
};

// Display/Device Endpoints

// Generate a unique 6-digit code for a new device
export const generatePairingCode = async (): Promise<{ pairing_code: string }> => {
  const response = await apiClient.get('/v1/displays/generate-code');
  return response.data;
};

// Pair the device (This might be polled by the device or called once)
// Note: The documentation says "Accepts 6-digit code from Stick".
// Usually, the stick generates the code, and the USER enters it on the admin panel.
// However, the route /v1/displays/pair says it accepts the code.
// If the device calls this, it means the device is sending the code it generated?
// Or maybe the device generates a code locally, displays it, and then polls an endpoint to see if it's been claimed?
// Let's look at the docs again: "Accepts 6-digit code from Stick; returns device_token and user_id."
// This implies the stick sends the code to the server to "register" it, or to check if it's valid.
// But usually, the flow is: Device gets code -> User enters code in Admin -> Admin API links code to User -> Device gets Token.
// Let's assume the device calls `generate-code` to get a code from the server, then displays it.
// Then it polls `pair` or a status endpoint?
// The route `/v1/displays/pair` takes `pairing_code` and returns `device_token`.
// This looks like the device sends the code it has (or user entered?) to get a token.
// Let's assume the device generates a code (via API), displays it, and then calls `pair` (maybe polling?) to see if the user has "claimed" it on the backend.
// Actually, looking at `routes.json`:
// `/v1/admin/claim-device` takes `pairing_code` and `user_id`. This is what the Admin does.
// `/v1/displays/pair` takes `pairing_code` and returns `device_token`.
// This suggests the device calls `pair` with the code it displayed, and if the admin has claimed it, it returns the token.
export const pairDevice = async (pairingCode: string): Promise<PairingResponse> => {
  const response = await apiClient.post('/v1/displays/pair', { pairing_code: pairingCode });
  return response.data;
};

export const getPlayerConfig = async (deviceToken: string): Promise<ConfigResponse> => {
  const response = await apiClient.get('/v1/player/config', {
    params: { device_token: deviceToken },
  });
  return response.data;
};

export const sendHeartbeat = async (
  deviceToken: string,
  status: string,
  appVersion: string
): Promise<{ success: boolean }> => {
  const response = await apiClient.post('/v1/player/heartbeat', {
    device_token: deviceToken,
    status,
    app_version: appVersion,
    timestamp: new Date().toISOString(),
  });
  return response.data;
};

// Admin Endpoints

export const claimDevice = async (pairingCode: string, userId: string): Promise<any> => {
  const response = await apiClient.post('/v1/admin/claim-device', {
    pairing_code: pairingCode,
    user_id: userId,
  });
  return response.data;
};

export const getUploadSignature = async (userId: string): Promise<UploadSignatureResponse> => {
  const response = await apiClient.post('/v1/admin/upload-signature', { user_id: userId });
  return response.data;
};

export const saveMediaMetadata = async (data: SaveMediaRequest): Promise<SaveMediaResponse> => {
  const response = await apiClient.post('/v1/admin/save-media', data);
  return response.data;
};

export const createPlaylist = async (
  userId: string,
  name: string,
  assets: any[]
): Promise<Playlist> => {
  const response = await apiClient.post('/v1/admin/playlist', {
    user_id: userId,
    name,
    assets,
  });
  return response.data;
};

export const assignPlaylist = async (deviceToken: string, playlistId: string,userId:string): Promise<any> => {
  console.log('Assigning playlist', deviceToken, playlistId);
  const response = await apiClient.post('/v1/admin/assign-playlist', {
    device_token: deviceToken,
    playlist_id: playlistId,
    user_id:userId
  });
  console.log('Playlist assigned response:', response.data);
  return response.data;
};

export const getDevices = async (userId: string): Promise<Device[]> => {
  const response = await apiClient.get('/v1/admin/devices', {
    params: { user_id: userId },
  });
  return response.data;
};

export const getPlaylists = async (userId: string): Promise<Playlist[]> => {
  const response = await apiClient.get('/v1/admin/playlists', {
    params: { user_id: userId },
  });
  return response.data;
};

export const getSyncStatus = async (userId: string, playlistId: string): Promise<SyncStatusResponse> => {
  const response = await apiClient.get('/v1/admin/sync-status', {
    params: { user_id: userId, playlist_id: playlistId },
  });
  return response.data;
};
