/* Authorization actions */
import ROUTER from '../views/routes';
import {LOCAL_STORAGE_AUTH, LOCAL_STORAGE_LOGINID} from "../constant";

// LOGIN
export const login = (history, auth) => {
    if ( auth ) {
        sessionStorage.setItem(LOCAL_STORAGE_AUTH, JSON.stringify(auth));
        sessionStorage.setItem(LOCAL_STORAGE_LOGINID, auth["loginId"]);
    }
    else {
        console.error("login failed");
        return false;
    }
}

// LOGOUT
export const logout = () => {
    sessionStorage.removeItem(LOCAL_STORAGE_AUTH);
    sessionStorage.removeItem(LOCAL_STORAGE_LOGINID);
}