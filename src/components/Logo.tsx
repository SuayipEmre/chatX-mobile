import React from 'react'
import { Text, View } from 'react-native'

type Props = {
    text : string
}
const Logo : React.FC<Props> = ({text}) => {
    return (
        <View className="items-center mb-16">
            <Text className="text-5xl font-extrabold tracking-wider text-white">
                Chat<Text className="text-blue-500">X</Text>
            </Text>

            <Text className="text-gray-400 mt-3 text-base tracking-tight">
                {text}
            </Text>
        </View>
    )
}

export default Logo