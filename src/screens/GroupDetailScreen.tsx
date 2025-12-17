import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import { useGetGroupDetailsQuery } from '../service/group.service'
import { useRoute } from '@react-navigation/native'
import Avatar from '../components/Avatar'
import { IGroupDetailType } from '../types/GroupDetailType'
import Ionicons from '@expo/vector-icons/Ionicons';
const GroupDetailScreen: React.FC = () => {
    const route = useRoute()
    const { groupId } = route.params as { groupId: string }
    const {
        data: groupDetailsData,
        isLoading: groupDetailsLoading,
        isError: groupDetailsIsError,
        error: groupDetailsError
    } = useGetGroupDetailsQuery(groupId,)

    console.log('groupDetailsData :', groupDetailsData);

    const renderContent = () => {
        const detail = groupDetailsData?.data as IGroupDetailType

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
                            return (
                                <View className='my-4' key={user._id}>
                                    <View className='flex-row items-center gap-5'>
                                        {user.avatar ? <Avatar avatar={user.avatar} /> : (
                                            <View className='w-12 h-12 rounded-full items-center justify-center bg-[#1A1D24]'>
                                                <Text className='text-white font-bold text-xl'>{user?.username?.slice(0, 2)}</Text>
                                            </View>
                                        )}
                                        <Text className='text-white font-bold'>{user.username}</Text>
                                    </View>
                                </View>
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