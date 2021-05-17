
let sidebarStaus = {isShow:false};

//------ to manage sidebar show/hide
export const checkSidebarStatus = (state = sidebarStaus,action ) => {
    if(action.type === "sidebar:showHide"){
        return  {isShow:!state.isShow};
    }
    return state;
}

export const showHideSidebar = () => {
    return{
        type:"sidebar:showHide"
    };
} 

export default showHideSidebar;

