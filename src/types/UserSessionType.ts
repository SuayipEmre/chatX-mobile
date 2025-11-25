export interface UserSession {
    user:         User;
    accessToken:  string;
    refreshToken: string;
}

export interface User {
    _id:       string;
    username:  string;
    email:     string;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}