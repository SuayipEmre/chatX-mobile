
export interface IGroupDetailType {
    _id: string,
    groupName: string,
    isGroupChat: boolean,
    users: User[],
    admin: Admin,
    avatar?: string,
    createdAt: string,
    updatedAt: string
}

type CommonUserFields = {
    _id: string,
    username: string,
    email: string,
    avatar?: string
}

type Admin = CommonUserFields





type User = CommonUserFields

