import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserSession } from "../../../types/UserSessionType";


type initialStateType = {
    userSession: UserSession | null | undefined
}
const initialState : initialStateType = {
    userSession : null 
}

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        _setUserSession: (state, action : PayloadAction<UserSession | null | undefined>) => {
            state.userSession = action.payload;
        },
        _clearUserSession: (state) => {
            state.userSession = null;
        },
    },
})


export const { _setUserSession, _clearUserSession } = UserSlice.actions;
export default UserSlice.reducer;