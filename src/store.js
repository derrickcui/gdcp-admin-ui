import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import * as createHistory from "history";
import rootReducer from './reducer/index';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage: storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const history = createHistory.createBrowserHistory();

const initialState = {}
const enhancers = []
const middleware = [
    thunk,
    routerMiddleware(history)
]

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension())
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
)

export const store = createStore(
    connectRouter(history)(persistedReducer),
    initialState,
    composedEnhancers
)

export const persistedStore = persistStore(store);