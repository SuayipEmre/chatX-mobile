import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useState } from 'react'
import { useGetGroupDetailsQuery } from '../service/group.service'
import { useRoute } from '@react-navigation/native'
import Avatar from '../components/Avatar'
import { CommonUserFields, GroupUserDetail, IGroupDetailType } from '../types/GroupDetailType'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserSession } from '../store/feature/user/hooks'
import Entypo from '@expo/vector-icons/Entypo';




const GroupDetailScreen: React.FC = () => {
    const [isUserDetailModalVisible, setIsUserDetailModalVisible] = useState<boolean>(false)
    const [selectedUser, setSelectedUser] = useState<null | CommonUserFields>(null)
    const route = useRoute()
    const userSession = useUserSession()
    const { groupId } = route.params as { groupId: string }
    const {
        data: groupDetailsData,
        isLoading: groupDetailsLoading,
        isError: groupDetailsIsError,
        error: groupDetailsError
    } = useGetGroupDetailsQuery(groupId,)


    const renderContent = () => {
        const detail = groupDetailsData?.data as IGroupDetailType
        let isAdmin

        if (groupDetailsLoading) {
            return <Text>Loading...</Text>
        }
        if (groupDetailsIsError) {
            return <Text>Error loading group details.</Text>
        }

        return (
            <View className='w-[90%] gap-10 self-center '>

                <View className='items-center gap-2'>
                    {
                        groupDetailsData?.data.avatar ? <Avatar
                            avatar={detail.avatar}
                            height={120}
                            width={120}
                        /> : <View className='w-28 h-28 rounded-full items-center justify-center bg-[#1A1D24]'>
                            <Text className='text-white font-bold text-xl'>{detail?.groupName?.slice(0, 2)}</Text>
                        </View>
                    }
                    <View className='items-center justify-center'>
                        <Text className='text-white text-2xl font-bold mb-4 tracking-[5px]'>{detail.groupName}</Text>
                        <View className="flex-row items-center">
                            <Text className="text-gray-300 font-medium">Group</Text>

                            <Text className="mx-2 text-blue-500">•</Text>

                            <Text className="text-blue-500 font-medium">
                                {detail?.users?.length} participants
                            </Text>
                        </View>


                    </View>
                </View>

                <View className='gap-5'>
                    <Text className='text-white font-bold text-xl'>Participants</Text>
                    <View>
                        {detail?.users?.map((user) => {
                             isAdmin = user._id === userSession?.user?._id

                            return (
                                <TouchableOpacity
                                onPress={() => {
                                    setSelectedUser(user)
                                    setIsUserDetailModalVisible(true)
                                }}
                                className='my-4' key={user._id}>
                                    <View className='flex-row items-center gap-5'>
                                        {user.avatar ? <Avatar avatar={user.avatar} /> : (
                                            <View className='w-12 h-12 rounded-full items-center justify-center bg-[#1A1D24]'>
                                                <Text className='text-white font-bold text-xl'>{user?.username?.slice(0, 2)}</Text>
                                            </View>
                                        )}
                                        <Text className='text-white font-bold'>
                                            {user.username}
                                        </Text>
                                        {isAdmin ? <Text className='text-[#FFBF00] font-medium text-sm'>Manager</Text> : <></>}
                                        {isAdmin && <Entypo name="remove-user" size={20} />}
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                <View>
                    <TouchableOpacity className='flex-row items-center gap-5'>
                        <Ionicons name="exit" size={24} color="red" />
                        <Text className='text-red-500 font-bold'>Exit</Text>
                    </TouchableOpacity>
                </View>
               
                <Modal
                    visible={isUserDetailModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsUserDetailModalVisible(false)}
                >
                    <Pressable
                        className="flex-1 bg-black/60 items-center justify-center"
                        onPress={() => setIsUserDetailModalVisible(false)}
                    >
                        <Pressable
                            onPress={() => { }}
                            className="w-fullbg-[#121212] rounded-2xl p-6 gap-6"
                        >
                         
                            <View className="items-center gap-3">
                                {selectedUser?.avatar ? (
                                    <Avatar avatar={selectedUser.avatar}  />
                                ) : (
                                    <View className='w-20 h-20 rounded-full items-center justify-center bg-[#1A1D24]'>
                                        <Text className='text-white font-bold text-xl'>
                                            {selectedUser?.username?.slice(0, 2)}
                                        </Text>
                                    </View>
                                )}

                                <Text className="text-white text-xl font-bold">
                                    {selectedUser?.username}
                                </Text>

                                {selectedUser?.email && (
                                    <Text className="text-gray-400 text-sm">
                                        {selectedUser.email}
                                    </Text>
                                )}
                            </View>

                       
                            {isAdmin && selectedUser?._id !== userSession?.user._id && (
                                <View className="gap-4 mt-4">
                                    <TouchableOpacity className="flex-row items-center gap-3">
                                        <Ionicons name="star-outline" size={20} color="#FFBF00" />
                                        <Text className="text-[#FFBF00] font-semibold">
                                            Make Group Admin
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="flex-row items-center gap-3">
                                        <Ionicons name="remove-circle-outline" size={24} color="red" />
                                        <Text className="text-red-500 font-semibold">
                                            Remove from Group
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                
                            <TouchableOpacity
                                onPress={() => setIsUserDetailModalVisible(false)}
                                className="mt-6"
                            >
                                <Text className="text-center text-gray-400">
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </Pressable>
                    </Pressable>
                </Modal>

            </View>


        )
    }

    //
    return (
        <View className='min-h-screen bg-black '>
            {renderContent()}
        </View>
    )
}

export default GroupDetailScreen

const styles = StyleSheet.create({})

/*

  <View className=''>
                        <Text className='text-white tracking-tight'>Created At : {formatDate(detail.createdAt)}</Text>
                        <Text className='text-white tracking-tight'>Last Update : {formatDate(detail.updatedAt)}</Text>
                    </View>

 */

