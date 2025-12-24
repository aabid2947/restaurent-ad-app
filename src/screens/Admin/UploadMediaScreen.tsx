import React, { useEffect, useState } from 'react';
import { View, Text,PermissionsAndroid, TouchableOpacity,Platform, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, UploadCloud, CheckCircle } from 'lucide-react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { theme } from '../../theme';
import { useApp } from '../../context/AppContext';
import { getUploadSignature, saveMediaMetadata } from '../../api/endpoints';

const UploadMediaScreen = () => {
  const navigation = useNavigation();
  const { userId } = useApp();
  const [loading, setLoading] = useState(false);
  const [uploadedAsset, setUploadedAsset] = useState<Asset | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  useEffect(() => {
    requestMediaPermissions();
  }, []);
  const handleUpload = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 1,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        Alert.alert('Error', result.errorMessage || 'Failed to pick media');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        await uploadFile(asset);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const requestMediaPermissions = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) { // Android 13+
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
      );
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
    }
  }
};

  const uploadFile = async (asset: Asset) => {
    setLoading(true);
    setUploadProgress(0);
    try {
      // Ensure we have the necessary fields
      if (!asset.uri || !asset.type) {
        throw new Error('Invalid media file selected');
      }

      // const cleanUri = Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', '');
const cleanUri =
  Platform.OS === 'android'
    ? asset.uri
    : asset.uri.replace('file://', '');
    // FIX 2: Ensure a valid filename with an extension
    // Cloudinary and the native upload layer need the extension to determine the blob type.
    const extension = asset.type.split('/')[1] || 'jpg';
    const fileName = asset.fileName || `upload_${Date.now()}.${extension}`;


      // 1. Get Signature from Backend
      console.log(userId)
      const signatureData = await getUploadSignature(userId!);
      console.log('Signature Data:', signatureData);
      const { signature, timestamp, api_key, folder, cloud_name } = signatureData;
      console.log(cleanUri, fileName, asset.type)

      // 2. Upload to Cloudinary
      const formData = new FormData();
      // formData.append('file', {
      //   uri: cleanUri,
      //   type: asset.type,
      //   name: fileName,
      // } as any);
      console.log('Uploading file:', asset.uri);
      formData.append('file', 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const resourceType = asset.type.startsWith('video') ? 'video' : 'image';
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;

      const xhr = new XMLHttpRequest();
      console.log('Starting upload to Cloudinary...');
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.open('POST', cloudinaryUrl);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(new Error('Cloudinary upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        
        xhr.send(formData);
      });
      console.log('Upload in progress...');

      const cloudinaryResponse = await uploadPromise;
      console.log('Cloudinary Response:', cloudinaryResponse);
      console.log(userId, cloudinaryResponse.secure_url, resourceType, cloudinaryResponse.public_id, cloudinaryResponse.duration, asset.fileName || 'unknown');
      // 3. Save Metadata to Backend
      await saveMediaMetadata({
        user_id: userId!,
        file_url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
        resource_type: resourceType,
        duration: cloudinaryResponse.duration, // Cloudinary returns duration for videos
        original_filename: asset.fileName || 'unknown',
      });
      console.log('Metadata saved to backend');

      setUploadedAsset(asset);
      Alert.alert('Success', 'Media uploaded successfully!');
    } catch (error: any) {
      console.error('Upload failed', error);
      Alert.alert('Error', 'Failed to upload media. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Media</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Uploading... {uploadProgress}%</Text>
          </View>
        ) : uploadedAsset ? (
          <View style={styles.successContainer}>
            <CheckCircle size={64} color={theme.colors.success} />
            <Text style={styles.successText}>Upload Complete!</Text>
            <Text style={styles.fileName}>{uploadedAsset.fileName}</Text>
            <TouchableOpacity 
              style={styles.uploadAnotherButton} 
              onPress={() => setUploadedAsset(null)}
            >
              <Text style={styles.uploadAnotherText}>Upload Another</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadArea} onPress={handleUpload}>
            <UploadCloud size={64} color={theme.colors.primary} />
            <Text style={styles.uploadText}>Tap to select Video or Image</Text>
            <Text style={styles.subText}>Supports MP4, JPG, PNG</Text>
          </TouchableOpacity>
        )}
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
    flex: 1,
    padding: theme.spacing.l,
    justifyContent: 'center',
  },
  uploadArea: {
    height: 300,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.l,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  uploadText: {
    marginTop: theme.spacing.m,
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  subText: {
    marginTop: theme.spacing.s,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.m,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.l,
  },
  successText: {
    marginTop: theme.spacing.m,
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  fileName: {
    marginTop: theme.spacing.s,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
  },
  uploadAnotherButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.m,
  },
  uploadAnotherText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UploadMediaScreen;
