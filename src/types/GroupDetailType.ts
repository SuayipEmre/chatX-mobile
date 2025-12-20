
export interface IGroupDetailType {
    _id: string,
    groupName: string,
    isGroupChat: boolean,
    users: GroupUserDetail[],
    admin: Admin,
    avatar?: string,
    createdAt: string,
    updatedAt: string
}

export type CommonUserFields = {
    _id: string,
    username: string,
    email: string,
    avatar?: string
}

type Admin = CommonUserFields





export type GroupUserDetail = CommonUserFields

