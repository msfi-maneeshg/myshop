let sidebarStaus = {isShow:false};
let isAdminLogin = JSON.parse(localStorage.getItem('userInfo'));
let loginStaus = {isLoggedin:false,userID:'',username:''};
if(isAdminLogin){
    loginStaus = {isLoggedin:true,userID:isAdminLogin.userID,username:isAdminLogin.username};
}

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

//--------- to manage login status
export const checkLoginStatus = (state=loginStaus,action)=>{
    if(action.type === "loginStatus"){
        return  {isLoggedin:action.payload.isLoggedin,userID:action.payload.userID,username:action.payload.username};
    }
    return state;
}

export const changeLoginStatus = (userInfo) => {
    let loginInfo;
    let isLogin = localStorage.getItem('userInfo');
    if(isLogin){
        localStorage.removeItem('userInfo');
        loginInfo = {isLoggedin:false,userID:"",username:""};
    }else{
        localStorage.setItem('userInfo',JSON.stringify(userInfo));
        loginInfo = {isLoggedin:true,userID:userInfo.userID,username:userInfo.username};
    }
    return{
        type:"loginStatus",
        payload:loginInfo
    };
} 