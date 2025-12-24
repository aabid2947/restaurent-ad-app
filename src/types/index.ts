// Device/Display Model
export interface Device {
  device_token: string;
  user_id: string;
  pairing_code?: string;
  playlist_id?: string;
  app_version?: string;
  status?: 'playing' | 'idle' | 'error';
  last_heartbeat?: string;
  download_status?: 'completed' | 'in_progress' | 'failed';
}

// Media Asset Model
export interface MediaAsset {
  asset_id: string;
  file_url: string;
  type: 'video' | 'image';
  playback_duration: number;
  checksum?: string;
}

// Playlist Configuration Model
export interface Playlist {
  playlist_id: string;
  name?: string;
  display_sequence: MediaAsset[];
  last_updated?: string;
}

// API Responses
export interface PairingResponse {
  device_token?: string;
  user_id?: string;
  message?: string;
}

export interface ConfigResponse {
  playlist_json: Playlist;
}

export interface UploadResponse {
  file_url: string;
  asset_id: string;
  type: 'video' | 'image';
  playback_duration: number;
}

export interface SyncStatusResponse {
  devices: {
    device_token: string;
    download_status: 'completed' | 'in_progress' | 'failed';
    last_heartbeat: string;
  }[];
}

export interface UploadSignatureResponse {
  timestamp: number;
  signature: string;
  api_key: string;
  folder: string;
  cloud_name: string;
}

export interface SaveMediaRequest {
  user_id: string;
  file_url: string;
  public_id: string;
  resource_type: 'image' | 'video';
  duration?: number;
  original_filename: string;
}

export interface SaveMediaResponse {
  message: string;
  asset: MediaAsset;
}

// Auth Models
export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  data: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}
