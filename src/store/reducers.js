import {combineReducers} from 'redux'
import {checkSidebarStatus,checkLoginStatus} from '../admin/reducers'
import {
    checkLoginStatus as UserLoginStatus,
    GetUserCartInfo,
    HomeLoginPopup,
} from '../front/reducers'

export const rootReducer = combineReducers({
    checkSidebarStatus,
    checkLoginStatus,
    UserLoginStatus,
    GetUserCartInfo,
    HomeLoginPopup,
});
export default rootReducer;