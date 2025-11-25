import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { logout } from "../service/auth.service";
import { setUserSession } from "../store/feature/user/actions";
import { clearUserSessionFromStorage } from "../utils/storage";
import { fetchUserProfile } from "../service/user.service";

const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchUserProfile();
      setUser(data);
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    const res = await logout();
    if (res?.statusCode === 200) {
      setUserSession(null);
      clearUserSessionFromStorage();
    }
  };

  return (
    <View className="flex-1 bg-black px-6 pt-16">

      {/* Header */}
      <Text className="text-white text-3xl font-bold mb-10">
        Profile
      </Text>

      {/* Avatar + Info */}
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="w-20 h-20 rounded-full bg-neutral-800 items-center justify-center">
          <EvilIcons name="user" size={55} color="white" />
        </View>

        <View className="ml-4">
          <Text className="text-white text-xl font-semibold">
            {user?.username}
          </Text>
          <Text className="text-neutral-400 mt-1">
            {user?.email}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-neutral-800 my-8" />

      {/* Edit Profile Button */}
      <TouchableOpacity
        className="py-3 mb-5"
      >
        <Text className="text-blue-500 text-lg font-semibold">
          Edit Profile
        </Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center gap-3"
      >
        <Entypo name="log-out" size={24} color="red" />
        <Text className="text-red-500 font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
