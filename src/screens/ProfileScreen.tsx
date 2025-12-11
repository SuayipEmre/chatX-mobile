import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { setUserSession } from "../store/feature/user/actions";
import { clearUserSessionFromStorage } from "../utils/storage";
import { useFetchUserProfileQuery } from "../service/user.service";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileNavigatorStackParamList } from "../navigation/types";
import { useSendLogoutRequestMutation } from "../service/auth.service";

const ProfileScreen = () => {
  const [logout] = useSendLogoutRequestMutation()
  const navigation = useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const { data: user } = useFetchUserProfileQuery({})


  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      if (res?.statusCode === 200) {
        setUserSession(null);
        clearUserSessionFromStorage()
      }
    } catch (error) {
      console.log("error : ", error);
      Alert.alert(
        "Logout Failed",
        "An error occurred while logging out. Please try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-black px-6 pt-16">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-10">
        <Text className="text-white text-3xl font-bold">Profile</Text>


        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfileScreen")}
        >
          <FontAwesome6 name="pen-to-square" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>


      <View className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
        <View className="items-center flex-row  gap-5">

          <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-4">
            {
              user?.data.avatar ? (
                <Image
                  source={{ uri: user?.data.avatar }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <EvilIcons name="user" size={70} color="white" />
              )
            }
          </View>

          <View>
            <Text className="text-white text-2xl font-bold">
              {user?.data.username}
            </Text>

            <Text className="text-neutral-400 mt-2">{user?.data.email}</Text>
          </View>
        </View>

        {/* ✅ INFO ROWS */}
        <View className="mt-8 gap-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-neutral-400">Username</Text>
            <Text className="text-white font-semibold">
              {user?.data.username}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-neutral-400">Email</Text>
            <Text className="text-white font-semibold">
              {user?.data.email}
            </Text>
          </View>
        </View>
      </View>

      {/* ✅ ACTION BUTTONS */}
      <View className="mt-10 gap-5">
        {/* EDIT PROFILE BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfileScreen")}
          className="flex-row items-center justify-center gap-3 bg-blue-600 py-4 rounded-2xl"
        >
          <FontAwesome6 name="user-pen" size={16} color="white" />
          <Text className="text-white font-semibold text-lg">
            Edit Profile
          </Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center gap-3 bg-neutral-900 border border-red-500 py-4 rounded-2xl"
        >
          <Entypo name="log-out" size={22} color="red" />
          <Text className="text-red-500 font-semibold text-lg">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
