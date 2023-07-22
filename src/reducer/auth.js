import {LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT_SUCCESS} from '../constant';

const initialState = {
    isAuth: false
};

const AuthReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_SUCCESS:
            return {
                isAuth: true
            }
        case LOGIN_FAILURE:
            return {
                isAuth: false
            }
        case LOGOUT_SUCCESS:
            return {
                isAuth: false
            }
        default:
            return state;
    }
}

export default AuthReducer;