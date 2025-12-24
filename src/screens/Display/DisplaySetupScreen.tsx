import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Touchable,TouchableOpacity } from 'react-native';
import { generatePairingCode, pairDevice } from '../../api/endpoints';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme';
import { Tv } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';


type NavigationProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;


const DisplaySetupScreen = () => {
  const [code, setCode] = useState<string | null>(null);
  const [status, setStatus] = useState('Generating code...');
  const { setDeviceToken } = useApp();
  const navigation = useNavigation<NavigationProp>();
  
  useEffect(() => {
    let pollingInterval: any=null;

    const setup = async () => {
      try {
        const { pairing_code } = await generatePairingCode();
        console.log('Generated pairing code:', pairing_code);
        setCode(pairing_code);
        setStatus('Waiting for pairing...');

        // Poll for pairing status
        pollingInterval = setInterval(async () => {
          try {
            const response = await pairDevice(pairing_code);
            
            if (response.device_token) {
              clearInterval(pollingInterval);
              await setDeviceToken(response.device_token);
            } else if (response.message) {
              setStatus(response.message);
            }
          } catch (error: any) {
            // Ignore errors while waiting, but log them
            console.log('Polling error:', error.message);
          }
        }, 5000);

      } catch (error) {
        console.error('Setup failed', error);
        setStatus('Error generating code. Please restart.');
      }
    };

    setup();

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Tv size={64} color={theme.colors.primary} style={{ marginBottom: theme.spacing.l }} />
      <Text style={styles.title}>Pair this Display</Text>
      <Text style={styles.subtitle}>Enter this code in your Admin Dashboard</Text>

      {code ? (
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{code}</Text>
        </View>
      ) : (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}

      <Text style={styles.status}>{status}</Text>

      <TouchableOpacity
        style={{ marginTop: theme.spacing.xl }}
        onPress={() => {
          // For simplicity, just reload the component to regenerate code
          setCode(null);
          setStatus('Generating code...');
          // Trigger useEffect by changing state
          setCode(null);
        }}>
        <Text style={{ color: theme.colors.primary }}>Regenerate Code</Text>
      </TouchableOpacity>

        {/* go back to previous page */}
      <TouchableOpacity
        style={{ marginTop: theme.spacing.l }}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={{ color: theme.colors.primary }}>Back to Role Selection</Text>
      </TouchableOpacity>
      
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
  codeContainer: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.l,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  code: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.text,
    letterSpacing: 8,
  },
  status: {
    ...theme.typography.caption,
    marginTop: theme.spacing.l,
  },
});

export default DisplaySetupScreen;
