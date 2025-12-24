import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { theme } from '../../theme';
import { useApp } from '../../context/AppContext';
import { createPlaylist } from '../../api/endpoints';

const CreatePlaylistScreen = () => {
  const navigation = useNavigation();
  const { userId } = useApp();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }
    if (!userId) return;

    setLoading(true);
    try {
      // Mock assets for now as we don't have a media selector implemented
      const mockAssets = [
        {
          asset_id: '1',
          file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          type: 'video',
          playback_duration: 60
        }
      ];
      
      await createPlaylist(userId, name, mockAssets);
      Alert.alert('Success', 'Playlist created!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Playlist</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Playlist Name</Text>
        <TextInput
          style={styles.input}
          placeholder="My Morning Menu"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.helperText}>
          * This will create a playlist with a sample video for demonstration.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
          <Save color="white" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Save Playlist'}</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: theme.spacing.l,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    fontSize: 16,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  helperText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreatePlaylistScreen;
