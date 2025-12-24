import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { claimDevice } from '../../api/endpoints';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme';
import { ArrowLeft } from 'lucide-react-native';

const AddDeviceScreen = () => {
  const navigation = useNavigation();
  const { userId } = useApp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    if (!userId) return;

    setLoading(true);
    try {
      await claimDevice(code, userId);
      Alert.alert('Success', 'Device paired successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to pair device. Check the code and try again.');
      console.error(error);
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
        <Text style={styles.headerTitle}>Add New Device</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Enter Pairing Code</Text>
        <Text style={styles.helperText}>
          Enter the 6-digit code displayed on the TV screen.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="123456"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleClaim}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Pair Device</Text>
          )}
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
  helperText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
  },
  input: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    fontSize: 24,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddDeviceScreen;
