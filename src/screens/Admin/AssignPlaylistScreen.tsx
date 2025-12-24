import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, Monitor, List as ListIcon } from 'lucide-react-native';
import { theme } from '../../theme';
import { useApp } from '../../context/AppContext';
import { getDevices, getPlaylists, assignPlaylist } from '../../api/endpoints';
import { Device, Playlist } from '../../types';

const AssignPlaylistScreen = () => {
  const navigation = useNavigation();
  const { userId } = useApp();
  
  const [devices, setDevices] = useState<Device[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [devicesData, playlistsData] = await Promise.all([
        getDevices(userId),
        getPlaylists(userId)
      ]);
      setDevices(devicesData || []);
      setPlaylists(playlistsData || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      Alert.alert('Error', 'Failed to load devices and playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedDevice || !selectedPlaylist) {
      Alert.alert('Error', 'Please select both a device and a playlist');
      return;
    }

    setAssigning(true);
    try {
      await assignPlaylist(selectedDevice, selectedPlaylist,userId);
      Alert.alert('Success', 'Playlist assigned successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Assignment failed', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to assign playlist');
    } finally {
      setAssigning(false);
    }
  };

  const renderDeviceItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        selectedDevice === item.device_token && styles.selectedItem
      ]}
      onPress={() => setSelectedDevice(item.device_token)}
    >
      <View style={styles.itemIcon}>
        <Monitor size={24} color={selectedDevice === item.device_token ? 'white' : theme.colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, selectedDevice === item.device_token && styles.selectedText]}>
          Device {item.device_token.substring(0, 6)}...
        </Text>
        <Text style={[styles.itemSubtitle, selectedDevice === item.device_token && styles.selectedText]}>
          Status: {item.status || 'Unknown'}
        </Text>
      </View>
      {selectedDevice === item.device_token && (
        <Check size={20} color="white" />
      )}
    </TouchableOpacity>
  );

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        selectedPlaylist === item.playlist_id && styles.selectedItem
      ]}
      onPress={() => setSelectedPlaylist(item.playlist_id)}
    >
      <View style={styles.itemIcon}>
        <ListIcon size={24} color={selectedPlaylist === item.playlist_id ? 'white' : theme.colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, selectedPlaylist === item.playlist_id && styles.selectedText]}>
          {item.name || 'Untitled Playlist'}
        </Text>
        <Text style={[styles.itemSubtitle, selectedPlaylist === item.playlist_id && styles.selectedText]}>
          {item.display_sequence?.length || 0} Assets
        </Text>
      </View>
      {selectedPlaylist === item.playlist_id && (
        <Check size={20} color="white" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Playlist</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Select Device</Text>
            {devices.length === 0 ? (
              <Text style={styles.emptyText}>No devices found. Pair a device first.</Text>
            ) : (
              <FlatList
                data={devices}
                renderItem={renderDeviceItem}
                keyExtractor={(item) => item.device_token}
                style={styles.list}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Select Playlist</Text>
            {playlists.length === 0 ? (
              <Text style={styles.emptyText}>No playlists found. Create one first.</Text>
            ) : (
              <FlatList
                data={playlists}
                renderItem={renderPlaylistItem}
                keyExtractor={(item) => item.playlist_id}
                style={styles.list}
              />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.assignButton,
              (!selectedDevice || !selectedPlaylist || assigning) && styles.disabledButton
            ]}
            onPress={handleAssign}
            disabled={!selectedDevice || !selectedPlaylist || assigning}
          >
            {assigning ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.assignButtonText}>Assign Playlist</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.m,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.l,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  list: {
    maxHeight: 200,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 200,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  itemIcon: {
    marginRight: theme.spacing.m,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  itemSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  selectedText: {
    color: 'white',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  assignButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginTop: 'auto',
  },
  disabledButton: {
    opacity: 0.5,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AssignPlaylistScreen;
