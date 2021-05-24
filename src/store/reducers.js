import {combineReducers} from 'redux'
import {checkSidebarStatus,checkLoginStatus} from '../admin/reducers'
import {checkLoginStatus as UserLoginStatus} from '../front/reducers'

export const rootReducer = combineReducers({
    checkSidebarStatus,
    checkLoginStatus,
    UserLoginStatus,
});
export default rootReducer;