/**
 * Created by Daguang Li on 11/27/2017.
 */
import { combineReducers } from "redux"
import common from "./common"
import login from './login'

const rootReducer = combineReducers({
    common,
    login,
});

export default rootReducer;