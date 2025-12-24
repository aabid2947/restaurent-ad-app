import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, Playlist } from '../types';

type AppMode = 'admin' | 'display' | 'unset';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  deviceToken: string | null;
  setDeviceToken: (token: string | null) => void;
  currentPlaylist: Playlist | null;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>('unset');
  const [userId, setUserIdState] = useState<string | null>(null);
  const [deviceToken, setDeviceTokenState] = useState<string | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorage();
  }, []);

  const loadStorage = async () => {
    try {
      const storedMode = await AsyncStorage.getItem('app_mode');
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedDeviceToken = await AsyncStorage.getItem('device_token');
      const storedPlaylist = await AsyncStorage.getItem('current_playlist');

      if (storedMode) setModeState(storedMode as AppMode);
      if (storedUserId) setUserIdState(storedUserId);
      if (storedDeviceToken) setDeviceTokenState(storedDeviceToken);
      if (storedPlaylist) setCurrentPlaylist(JSON.parse(storedPlaylist));
    } catch (e) {
      console.error('Failed to load storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const setMode = async (newMode: AppMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem('app_mode', newMode);
  };

  const setUserId = async (id: string | null) => {
    setUserIdState(id);
    if (id) {
      await AsyncStorage.setItem('user_id', id);
    } else {
      await AsyncStorage.removeItem('user_id');
    }
  };

  const setDeviceToken = async (token: string | null) => {
    setDeviceTokenState(token);
    if (token) {
      await AsyncStorage.setItem('device_token', token);
    } else {
      await AsyncStorage.removeItem('device_token');
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setModeState('unset');
    setUserIdState(null);
    setDeviceTokenState(null);
    setCurrentPlaylist(null);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        userId,
        setUserId,
        deviceToken,
        setDeviceToken,
        currentPlaylist,
        setCurrentPlaylist,
        isLoading,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
