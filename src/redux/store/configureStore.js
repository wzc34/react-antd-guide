/**
 * Created by Daguang Li on 11/27/2017.
 */
import { createStore, applyMiddleware } from "redux"
import rootReducer from "@redux/reducers/index"
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from '@redux/store/promiseMiddleware';
import asyncActionCallbackMiddleware from '@redux/store/asyncActionCallbackMiddleware';
import utilsMiddleware from '@redux/store/utilsMiddleware';

let middlewares = [
    thunkMiddleware,
    promiseMiddleware,
    asyncActionCallbackMiddleware,
    utilsMiddleware,
];

const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares)
);
export default store;