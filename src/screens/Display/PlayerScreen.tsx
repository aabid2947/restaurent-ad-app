import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
// import {Image} from 'expo-image';
import { getPlayerConfig, sendHeartbeat } from '../../api/endpoints';
import { useApp } from '../../context/AppContext';
import { Playlist, MediaAsset } from '../../types';
import { theme } from '../../theme';

const PlayerScreen = () => {
  const { deviceToken, setDeviceToken } = useApp();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Heartbeat timer
  useEffect(() => {
    if (!deviceToken) return;

    const heartbeatInterval = setInterval(() => {
      sendHeartbeat(deviceToken, 'playing', '1.0.0')
        .catch(err => console.error('Heartbeat failed', err));
    }, 30000); // Every 30 seconds

    return () => clearInterval(heartbeatInterval);
  }, [deviceToken]);

  // Fetch Config
  useEffect(() => {
    const fetchConfig = async () => {
      if (!deviceToken) return;
      try {
        const response = await getPlayerConfig(deviceToken);
        console.log('Fetched player config:', response);
        if (response.playlist_json) {
          setPlaylist(response.playlist_json);
          setError(null);
        } else {
          setError('No playlist assigned');
        }
      } catch (err: any) {
        console.error('Config fetch failed', err);
        // If device is deleted or owner is deleted (403/404), unpair
        if (err.response && (err.response.status === 403 || err.response.status === 404)) {
           setError('Device unauthorized. Resetting...');
           setTimeout(() => {
             setDeviceToken(null);
           }, 2000);
        } else {
          setError('Failed to load configuration');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
    // Poll for config updates every minute
    const configInterval = setInterval(fetchConfig, 60000);
    return () => clearInterval(configInterval);
  }, [deviceToken]);

  // Playlist Logic
  useEffect(() => {
    if (!playlist || !playlist.display_sequence || playlist.display_sequence.length === 0) return;

    const currentAsset = playlist.display_sequence[currentIndex];
    
    if (currentAsset.type === 'image') {
      const duration = (currentAsset.playback_duration || 10) * 1000;
      const timer = setTimeout(() => {
        nextAsset();
      }, duration);
      return () => clearTimeout(timer);
    }
    // For video, we rely on onEnd callback
  }, [currentIndex, playlist]);

  const nextAsset = () => {
    if (!playlist || !playlist.display_sequence) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.display_sequence.length);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading Player...</Text>
      </View>
    );
  }

  if (error || !playlist || !playlist.display_sequence.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Waiting for content...'}</Text>
      </View>
    );
  }

  const currentAsset = playlist.display_sequence[currentIndex];

  return (
    <View style={styles.container}>
      {currentAsset.type === 'video' ? (
        <Video
          source={{ uri: currentAsset.file_url }}
          style={styles.fullScreen}
          resizeMode="cover"
          onEnd={nextAsset}
          onError={(e) => {
            console.error('Video Error', e);
            nextAsset(); // Skip on error
          }}
        />
      ) : (
        < Image
          style={styles.fullScreen}
          source={{ uri: currentAsset.file_url }}
          // contentFit="cover"
          onError={(e) => {
            console.error('Image Error', e);
            nextAsset(); // Skip on error
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 18,
  },
});

export default PlayerScreen;
