import {combineReducers} from 'redux'
import {checkSidebarStatus} from '../admin/reducers'

export const rootReducer = combineReducers({
    checkSidebarStatus,
});
export default rootReducer;