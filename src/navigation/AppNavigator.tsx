import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { ActivityIndicator, View } from 'react-native';

// Screens
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import AdminLoginScreen from '../screens/Admin/AdminLoginScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import DisplaySetupScreen from '../screens/Display/DisplaySetupScreen';
import PlayerScreen from '../screens/Display/PlayerScreen';
import AddDeviceScreen from '../screens/Admin/AddDeviceScreen';
import UploadMediaScreen from '../screens/Admin/UploadMediaScreen';
import CreatePlaylistScreen from '../screens/Admin/CreatePlaylistScreen';
import AssignPlaylistScreen from '../screens/Admin/AssignPlaylistScreen';

export type RootStackParamList = {
  RoleSelection: undefined;
  AdminLogin: undefined;
  AdminDashboard: undefined;
  DisplaySetup: undefined;
  Player: undefined;
  AddDevice: undefined;
  UploadMedia: undefined;
  CreatePlaylist: undefined;
  AssignPlaylist: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isLoading, mode, deviceToken, userId } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        {mode === 'unset' ? (
          <>
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            <Stack.Screen name="DisplaySetup" component={DisplaySetupScreen} />
          </>
        ) : mode === 'admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
            <Stack.Screen name="UploadMedia" component={UploadMediaScreen} />
            <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
            <Stack.Screen name="AssignPlaylist" component={AssignPlaylistScreen} />
          </>
        ) : (
          <>
            {deviceToken ? (
              <Stack.Screen name="Player" component={PlayerScreen} />
            ) : (
              <Stack.Screen name="DisplaySetup" component={DisplaySetupScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
