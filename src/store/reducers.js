import {combineReducers} from 'redux'
import {checkSidebarStatus,checkLoginStatus} from '../admin/reducers'

export const rootReducer = combineReducers({
    checkSidebarStatus,
    checkLoginStatus,
});
export default rootReducer;