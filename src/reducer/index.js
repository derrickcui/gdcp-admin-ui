import { combineReducers } from 'redux';
import AuthReducer from './auth';

const appReducer = combineReducers({
    auth: AuthReducer
});

const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === 'SUCCESS') {
        state = undefined;
    }


    return appReducer(state, action);
};

export default rootReducer;