import { _clearUserSession, _setUserSession } from ".";
import { UserSession } from "../../../types/UserSessionType";
import { store } from "../../app/store";
import {api} from "../../../service/api";
export const setUserSession = (userSession : UserSession | null) => store.dispatch(_setUserSession(userSession))

export const clearUserSession = () => {
    store.dispatch(_clearUserSession())
    store.dispatch(api.util.resetApiState())
}