import { _clearUserSession, _setUserSession } from ".";
import { UserSession } from "../../../types/UserSessionType";
import { store } from "../../app/store";

export const setUserSession = (userSession : UserSession | null) => store.dispatch(_setUserSession(userSession))

export const clearUserSession = () => store.dispatch(_clearUserSession())