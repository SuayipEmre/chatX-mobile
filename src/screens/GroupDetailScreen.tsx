import {
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useState } from 'react'
import {
    useChangeGroupAdminMutation,
    useGetGroupDetailsQuery,
    useRemoveFromGroupMutation,
    useRenameGroupMutation,
    useAddUserToGroupMutation,
} from '../service/group.service'
import { TextInput } from 'react-native'
import { useRoute } from '@react-navigation/native'
import Avatar from '../components/Avatar'
import {
    CommonUserFields,
    IGroupDetailType,
} from '../types/GroupDetailType'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useUserSession } from '../store/feature/user/hooks'
import CreateChatModal from '../components/SearchUserModal'

const GroupDetailScreen: React.FC = () => {
    const route = useRoute()
    const { groupId } = route.params as { groupId: string }

    const userSession = useUserSession()
    const currentUserId = userSession?.user?._id

    const [isUserDetailModalVisible, setIsUserDetailModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState<CommonUserFields | null>(null)

    const {
        data: groupDetailsData,
        isLoading,
        isError,
        refetch,
    } = useGetGroupDetailsQuery(groupId)

    const [removeFromGroup] = useRemoveFromGroupMutation()
    const [changeGroupAdmin] = useChangeGroupAdminMutation()
    const [renameGroup] = useRenameGroupMutation()
    const [addUser] = useAddUserToGroupMutation()

    const [isRenameModalVisible, setIsRenameModalVisible] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [renaming, setRenaming] = useState(false)

    const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false)
    const [adding, setAdding] = useState(false)

    if (isLoading) return <Text>Loading...</Text>
    if (isError || !groupDetailsData)
        return <Text>Error loading group</Text>

    const detail = groupDetailsData.data as IGroupDetailType

    /* is the current user an admin  */
    const isCurrentUserAdmin = detail.admin._id === currentUserId

    /* ---------------- ACTIONS ---------------- */

    const handleRemoveParticipant = async (userId: string) => {
        try {
            await removeFromGroup({ groupId, userId }).unwrap()
            await refetch()
            Alert.alert('Success', 'Participant removed')
        } catch (err: any) {
            Alert.alert(
                'Error',
                err?.data?.message || 'Remove failed'
            )
        } finally {
            setIsUserDetailModalVisible(false)
        }
    }

    const handleChangeAdmin = async (userId: string) => {
        try {
            await changeGroupAdmin({
                groupId,
                newAdminId: userId,
            }).unwrap()

            await refetch()
            Alert.alert('Success', 'Admin updated')
        } catch (err: any) {
            Alert.alert(
                'Error',
                err?.data?.message || 'Change admin failed'
            )
        } finally {
            setIsUserDetailModalVisible(false)
        }
    }

    const handleRenameGroup = async () => {
        if (!newGroupName.trim()) return;
        try {
            setRenaming(true)
            await renameGroup({ groupId, newName: newGroupName.trim() }).unwrap()
            Alert.alert('Success', 'Group renamed successfully')
            setIsRenameModalVisible(false)
            setNewGroupName('')
            refetch()
        } catch (err: any) {
            Alert.alert('Error', err?.data?.message || 'Renaming failed')
        } finally {
            setRenaming(false)
        }
    }

    // For simplicity, we'll re-use the SearchUserModal (which we renamed to CreateChatModal based on imports)
    // or we can build a simple list. But let's just make a function that receives the selected users from the modal.
    const handleAddUserToGroup = async (selectedUsers: { _id: string }[]) => {
        if (!selectedUsers.length) return;
        try {
            setAdding(true)
            // Backend endpoint `/groups/add-user` expects `groupId` and `userId`
            for (const user of selectedUsers) {
                await addUser({ groupId, userId: user._id }).unwrap()
            }
            Alert.alert('Success', 'Users added successfully')
            setIsAddUserModalVisible(false)
            refetch()
        } catch (err: any) {
            Alert.alert('Error', err?.data?.message || 'Failed to add user')
        } finally {
            setAdding(false)
        }
    }

    /* ---------------- UI ---------------- */

    return (
        <View className="min-h-screen bg-black">
            <View className="w-[90%] self-center gap-10">

                {/* GROUP HEADER */}
                <View className="items-center gap-2">
                    {detail.avatar ? (
                        <Avatar avatar={detail.avatar} height={120} width={120} />
                    ) : (
                        <View className="w-28 h-28 rounded-full bg-[#1A1D24] items-center justify-center">
                            <Text className="text-white text-xl font-bold">
                                {detail.groupName.slice(0, 2)}
                            </Text>
                        </View>
                    )}

                    <View className="flex-row items-center gap-3">
                        <Text className="text-white text-2xl font-bold tracking-[5px]">
                            {detail.groupName}
                        </Text>
                        {isCurrentUserAdmin && (
                            <TouchableOpacity onPress={() => {
                                setNewGroupName(detail.groupName)
                                setIsRenameModalVisible(true)
                            }}>
                                <Ionicons name="pencil" size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* RENAME MODAL */}
                    <Modal
                        visible={isRenameModalVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setIsRenameModalVisible(false)}
                    >
                        <Pressable
                            className="flex-1 bg-black/60 items-center justify-center p-6"
                            onPress={() => setIsRenameModalVisible(false)}
                        >
                            <Pressable className="w-full bg-[#121212] rounded-2xl p-6 gap-6">
                                <Text className="text-white text-xl font-bold">Rename Group</Text>
                                <View className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 h-12 justify-center">
                                    <TextInput
                                        className="text-white text-base"
                                        value={newGroupName}
                                        onChangeText={setNewGroupName}
                                        placeholder="Enter new group name"
                                        placeholderTextColor="#777"
                                        autoFocus
                                    />
                                </View>
                                <View className="flex-row justify-end gap-4 mt-2">
                                    <TouchableOpacity onPress={() => setIsRenameModalVisible(false)} className="py-2 px-4">
                                        <Text className="text-neutral-400 font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleRenameGroup}
                                        disabled={renaming || !newGroupName.trim()}
                                        className={`py-2 px-6 rounded-xl ${renaming || !newGroupName.trim() ? "bg-neutral-700" : "bg-primary"}`}
                                        style={{ backgroundColor: renaming || !newGroupName.trim() ? '#404040' : '#FF5B04' }}
                                    >
                                        <Text className="text-white font-semibold">Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </Pressable>
                    </Modal>

                    <View className="flex-row items-center">
                        <Text className="text-gray-300">Group</Text>
                        <Text className="mx-2 text-blue-500">•</Text>
                        <Text className="text-blue-500">
                            {detail.users.length} participants
                        </Text>
                    </View>
                </View>

                {/* PARTICIPANTS */}
                <View className="gap-5">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-white text-xl font-bold">
                            Participants
                        </Text>
                        {isCurrentUserAdmin && (
                            <TouchableOpacity
                                onPress={() => setIsAddUserModalVisible(true)}
                                className="flex-row items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800"
                            >
                                <Ionicons name="person-add" size={16} color="#FF5B04" />
                                <Text className="text-[#FF5B04] text-sm font-semibold">Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {detail.users.map(user => {
                        const isGroupAdmin = detail.admin._id === user._id

                        return (
                            <TouchableOpacity
                                key={user._id}
                                className="my-3"
                                onPress={() => {
                                    setSelectedUser(user)
                                    setIsUserDetailModalVisible(true)
                                }}
                            >
                                <View className="flex-row items-center gap-5">
                                    {user.avatar ? (
                                        <Avatar avatar={user.avatar} />
                                    ) : (
                                        <View className="w-12 h-12 rounded-full bg-[#1A1D24] items-center justify-center">
                                            <Text className="text-white font-bold">
                                                {user.username.slice(0, 2)}
                                            </Text>
                                        </View>
                                    )}

                                    <Text className="text-white font-bold">
                                        {user.username}
                                    </Text>

                                    {isGroupAdmin && (
                                        <Text className="text-[#FFBF00] text-sm">
                                            Manager
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                {/* USER DETAIL MODAL */}
                <Modal
                    visible={isUserDetailModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() =>
                        setIsUserDetailModalVisible(false)
                    }
                >
                    <Pressable
                        className="flex-1 bg-black/60 items-center justify-center"
                        onPress={() =>
                            setIsUserDetailModalVisible(false)
                        }
                    >
                        <Pressable className="w-[90%] bg-[#121212] rounded-2xl p-6 gap-6">
                            {selectedUser && (
                                <>
                                    <View className="items-center gap-3">
                                        {selectedUser.avatar ? (
                                            <Avatar avatar={selectedUser.avatar} />
                                        ) : (
                                            <View className="w-20 h-20 rounded-full bg-[#1A1D24] items-center justify-center">
                                                <Text className="text-white text-xl font-bold">
                                                    {selectedUser.username.slice(0, 2)}
                                                </Text>
                                            </View>
                                        )}

                                        <Text className="text-white text-xl font-bold">
                                            {selectedUser.username}
                                        </Text>

                                        <Text className="text-gray-400">
                                            {selectedUser.email}
                                        </Text>
                                    </View>

                                    {/* ADMIN ACTIONS */}
                                    {isCurrentUserAdmin &&
                                        selectedUser._id !== detail.admin._id && (
                                            <View className="gap-4 mt-4">
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleChangeAdmin(selectedUser._id)
                                                    }
                                                    className="flex-row items-center gap-3"
                                                >
                                                    <Ionicons
                                                        name="star-outline"
                                                        size={20}
                                                        color="#FFBF00"
                                                    />
                                                    <Text className="text-[#FFBF00]">
                                                        Make Group Admin
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleRemoveParticipant(
                                                            selectedUser._id
                                                        )
                                                    }
                                                    className="flex-row items-center gap-3"
                                                >
                                                    <Ionicons
                                                        name="remove-circle-outline"
                                                        size={22}
                                                        color="red"
                                                    />
                                                    <Text className="text-red-500">
                                                        Remove from Group
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                </>
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>

                {/* ADD USER MODAL */}
                <CreateChatModal
                    visible={isAddUserModalVisible}
                    onClose={() => setIsAddUserModalVisible(false)}
                    onCreateChat={handleAddUserToGroup}
                    userSession={userSession!}
                />
            </View>
        </View>
    )
}

export default GroupDetailScreen

const styles = StyleSheet.create({})
