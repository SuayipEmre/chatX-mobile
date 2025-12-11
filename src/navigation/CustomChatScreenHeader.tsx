import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorStackParamList } from './types'
import { RouteProp } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';


type Props = {
    navigation: NativeStackNavigationProp<MainNavigatorStackParamList, "ChatScreen", undefined>,
    route : RouteProp<MainNavigatorStackParamList, "ChatScreen">
}
const CustomChatScreenHeader : React.FC<Props> = ({route, navigation}) => {
  return (
    <View
    className='bg-black h-[90px] pt-10 items-center flex-row justify-between px-5 '
  >
    <AntDesign name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />

    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
      {route.params?.otherUserName || "Chat"}
    </Text>

    <Text />
  </View>
  )
}

export default CustomChatScreenHeader

const styles = StyleSheet.create({})