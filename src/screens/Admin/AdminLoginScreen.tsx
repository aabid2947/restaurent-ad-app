import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme';
import { LogIn, UserPlus } from 'lucide-react-native';
import { loginUser, registerUser } from '../../api/endpoints';

const AdminLoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setUserId, setMode } = useApp();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    setLoading(true);
    try {
      let response;
      console.log(isLogin)
      if (isLogin) {
        response = await loginUser({ email, password });
      } else {
        console.log(email, password, name)
        response = await registerUser({ email, password, name });
      }

      if (response && response.isAdmin) {
        // Assuming the API returns user object with id
        // We might also want to store the token in a real app
         setUserId(response._id ); 
         setMode('admin');
      } else {
        Alert.alert('Error', 'Authentication failed');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Admin Login' : 'Register Admin'}</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Enter your credentials to continue' : 'Create a new admin account'}
        </Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              {isLogin ? <LogIn color="white" size={20} style={{ marginRight: 8 }} /> : <UserPlus color="white" size={20} style={{ marginRight: 8 }} />}
              <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
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
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: theme.spacing.s,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: theme.spacing.l,
  },
  switchText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
});

export default AdminLoginScreen;
