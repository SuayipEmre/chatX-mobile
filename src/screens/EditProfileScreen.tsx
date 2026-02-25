import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { useFetchUserProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation } from "../service/user.service";

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [updateProfile] = useUpdateProfileMutation()
  const [uploadAvatar] = useUploadAvatarMutation()

  const { data: profileData, isError, isLoading } = useFetchUserProfileQuery({})

  console.log('profile', profileData);

  useEffect(() => {

    if (isLoading) return;
    if (isError) {
      Alert.alert("Error", "Failed to load profile data");
      return;
    }

    setUsername(profileData?.data.username || "");
    setEmail(profileData?.data.email || "");
    setAvatar(profileData?.data.avatar || "");
    setAvatarPreview(profileData?.data.avatar || null);
  }, []);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission required", "Gallery permission is required");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.3,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;
      const previewUri = result.assets[0].uri;

      console.log('Picked image base64 length : ', base64?.length);



      setAvatarPreview(previewUri);

      try {
        setUploading(true);

        const data = await uploadAvatar(base64!).unwrap()

        setAvatar(data.data.imageUrl);

      } catch (err) {
        console.log('Upload avatar error : ', err);

        Alert.alert("Upload Failed", "Avatar upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!username && !email && !avatar) {
      return Alert.alert("Error", "At least one field is required");
    }

    try {
      setSaving(true);

      await updateProfile({
        email,
        username,
        avatar,
      });

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-6 pt-16">

      {/* ✅ AVATAR + UPLOAD */}
      <View className="items-center mb-10">
        <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
          <View className="w-28 h-28 rounded-full bg-neutral-800 items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <Image
                source={{ uri: avatar ?? avatarPreview }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <EvilIcons name="user" size={80} color="white" />
            )}

            {/* ✅ UPLOAD LOADER */}
            {uploading && (
              <View className="absolute inset-0 bg-black/60 items-center justify-center">
                <ActivityIndicator color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <Text className="text-neutral-400 mt-3">
          Tap to change avatar
        </Text>
      </View>

      {/* ✅ INPUTS */}
      <View className="gap-5">
        {/* USERNAME */}
        <View>
          <Text className="text-neutral-400 mb-2">Username</Text>
          <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-2xl px-4 h-12">
            <FontAwesome6 name="user" size={16} color="#9ca3af" />
            <TextInput
              className="flex-1 text-white ml-3"
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#777"
            />
          </View>
        </View>

        {/* EMAIL */}
        <View>
          <Text className="text-neutral-400 mb-2">Email</Text>
          <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-2xl px-4 h-12">
            <FontAwesome6 name="envelope" size={16} color="#9ca3af" />
            <TextInput
              className="flex-1 text-white ml-3"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#777"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>

      {/* ✅ SAVE BUTTON */}
      <TouchableOpacity
        disabled={saving || uploading}
        onPress={handleUpdateProfile}
        className={`mt-10 py-4 rounded-2xl items-center ${saving || uploading ? "bg-neutral-700" : "bg-blue-600"
          }`}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Save Changes
          </Text>
        )}
      </TouchableOpacity>

      {/* ✅ CHANGE PASSWORD NAV BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ChangePasswordScreen")}
        className="mt-6 py-4 rounded-2xl items-center border border-neutral-700 bg-neutral-900"
      >
        <Text className="text-neutral-300 font-semibold text-lg">
          Change Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;
