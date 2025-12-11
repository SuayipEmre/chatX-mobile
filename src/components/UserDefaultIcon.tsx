import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons'

const UserDefaultIcon = () => {
    return (
        <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center">
            <EvilIcons name="user" size={30} color="white" />
        </View>
    )
}

export default UserDefaultIcon
