import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

type Props = {
    label: string,
    value: string
    onChange: (value: string) => void,
    placeholder?: string,
    secureTextEntry?: boolean
}
const AuthFormInput: React.FC<Props> = ({ label, onChange, value, placeholder, secureTextEntry }) => {
    return (
        <View className="gap-2">
            <Text className="text-gray-300 text-sm">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#6b7280"
                autoCapitalize='none'
                secureTextEntry={secureTextEntry}
                className="
            bg-neutral-900 
            border border-neutral-800 
            rounded-2xl
            px-4 py-4
            text-white
            text-base
            shadow-sm shadow-black/30
          "
            />
        </View>
    )
}

export default AuthFormInput

const styles = StyleSheet.create({})