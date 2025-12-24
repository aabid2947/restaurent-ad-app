import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PlusCircle, Upload, List, LogOut, PlaySquare } from 'lucide-react-native';
import { theme } from '../../theme';
import { useApp } from '../../context/AppContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AdminDashboard'>;

const AdminDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { logout, userId } = useApp();

  const menuItems = [
    {
      title: 'Add New Device',
      description: 'Pair a new TV stick using its code',
      icon: <PlusCircle size={32} color={theme.colors.primary} />,
      action: () => navigation.navigate('AddDevice'),
    },
    {
      title: 'Upload Media',
      description: 'Upload videos and images to the cloud',
      icon: <Upload size={32} color={theme.colors.primary} />,
      action: () => navigation.navigate('UploadMedia'),
    },
    {
      title: 'Create Playlist',
      description: 'Organize media into a sequence',
      icon: <List size={32} color={theme.colors.primary} />,
      action: () => navigation.navigate('CreatePlaylist'),
    },
    {
      title: 'Assign Playlist',
      description: 'Send a playlist to a device',
      icon: <PlaySquare size={32} color={theme.colors.primary} />,
      action: () => navigation.navigate('AssignPlaylist'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>User: {userId}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <LogOut size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={item.action}>
            <View style={styles.iconContainer}>{item.icon}</View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    marginTop: 4,
  },
  logoutButton: {
    padding: theme.spacing.s,
  },
  content: {
    padding: theme.spacing.l,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginRight: theme.spacing.m,
    padding: theme.spacing.s,
    backgroundColor: '#E0F2FE',
    borderRadius: theme.borderRadius.m,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default AdminDashboardScreen;
