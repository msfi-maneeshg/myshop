import {combineReducers} from 'redux'
import {checkSidebarStatus,checkLoginStatus} from '../admin/reducers'
import {
    checkLoginStatus as UserLoginStatus,
    GetUserCartInfo,
} from '../front/reducers'

export const rootReducer = combineReducers({
    checkSidebarStatus,
    checkLoginStatus,
    UserLoginStatus,
    GetUserCartInfo,
});
export default rootReducer;