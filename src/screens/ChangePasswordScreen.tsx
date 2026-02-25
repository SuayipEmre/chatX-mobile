import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { useChangePasswordMutation } from "../service/user.service";

const ChangePasswordScreen = () => {
    const navigation = useNavigation<any>();

    const [saving, setSaving] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [changePassword] = useChangePasswordMutation()

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            return Alert.alert("Error", "Both fields are required");
        }

        try {
            setSaving(true);

            await changePassword({
                oldPassword,
                newPassword
            }).unwrap();

            Alert.alert("Success", "Password changed successfully");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert(
                "Update Failed",
                error?.data?.message || error?.message || "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-black px-6 pt-16">
            <View className="mb-10">
                <Text className="text-white text-3xl font-bold">Change Password</Text>
                <Text className="text-neutral-400 mt-2 text-base">Make sure your new password is secure.</Text>
            </View>

            <View className="gap-5">
                <View>
                    <Text className="text-neutral-400 mb-2">Current Password</Text>
                    <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-2xl px-4 h-12">
                        <FontAwesome6 name="lock" size={16} color="#9ca3af" />
                        <TextInput
                            className="flex-1 text-white ml-3"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            placeholder="Enter current password"
                            placeholderTextColor="#777"
                            secureTextEntry
                        />
                    </View>
                </View>

                <View>
                    <Text className="text-neutral-400 mb-2">New Password</Text>
                    <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-2xl px-4 h-12">
                        <FontAwesome6 name="key" size={16} color="#9ca3af" />
                        <TextInput
                            className="flex-1 text-white ml-3"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter new password"
                            placeholderTextColor="#777"
                            secureTextEntry
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity
                disabled={saving}
                onPress={handleChangePassword}
                className={`mt-10 py-4 rounded-2xl items-center ${saving ? "bg-neutral-700" : "bg-primary"}`}
                style={{ backgroundColor: saving ? '#404040' : '#FF5B04' }}
            >
                {saving ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-semibold text-lg">
                        Update Password
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ChangePasswordScreen;
