import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Monitor, User } from 'lucide-react-native';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

const RoleSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setMode } = useApp();

  const handleSelectAdmin = () => {
    // We don't set mode yet, we wait for login
    navigation.navigate('AdminLogin');
  };

  const handleSelectDisplay = () => {
    setMode('display');
    // Navigation will be handled by the AppNavigator based on mode change
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>
      <Text style={styles.subtitle}>Choose how you want to use this device</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={handleSelectDisplay}>
          <View style={styles.iconContainer}>
            <Monitor size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.optionTitle}>Display Screen</Text>
          <Text style={styles.optionDescription}>
            Turn this device into a digital signage player
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleSelectAdmin}>
          <View style={styles.iconContainer}>
            <User size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.optionTitle}>Admin Dashboard</Text>
          <Text style={styles.optionDescription}>
            Manage devices, playlists, and media
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.l,
    flexWrap: 'wrap',
  },
  optionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: theme.spacing.s,
  },
  iconContainer: {
    backgroundColor: '#E0F2FE', // Very light blue
    padding: theme.spacing.m,
    borderRadius: 50,
    marginBottom: theme.spacing.m,
  },
  optionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  optionDescription: {
    ...theme.typography.caption,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default RoleSelectionScreen;
