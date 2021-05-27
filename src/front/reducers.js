//--------- to manage login status ------------
let isUserLogin = JSON.parse(localStorage.getItem('userInfo'));
let loginStaus = {isLoggedin:false,userID:'',username:''};
if(isUserLogin){
    loginStaus = {isLoggedin:true,userID:isUserLogin.userID,username:isUserLogin.username};
}

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

//----------------------------- to manage add to cart ----------------
let userCartInfo  = JSON.parse(localStorage.getItem('cartItems'));
let defaultUserCartInfo = {items:[]};
if(userCartInfo){
    defaultUserCartInfo = {...userCartInfo};
}

export const GetUserCartInfo = (state = defaultUserCartInfo, action)=>{
    let tempState = state;
    let productInfo = action.payload;
    let foundInOldList;
    let productIndex;
    if(action && action.type && action.payload){
        foundInOldList = tempState.items.filter((item) => item.productID === productInfo.productID);
        productIndex = tempState.items.findIndex(item => item.productID === productInfo.productID);
    }
    switch(action.type){
        case  'cart:add':
            if(!foundInOldList || foundInOldList.length === 0){
                tempState.items.push({productID:productInfo.productID,productQuantity:1})
            }
            break;
        case 'cart:update':
            if(productIndex >= 0){
                let tempValue  = tempState.items[productIndex];
                tempValue.productQuantity = productInfo.productQuantity
                tempState.items[productIndex] = {...tempValue}
            }
            break;     
        case 'cart:update:remove':
            if(productIndex >= 0){
                let tempValue  = tempState.items[productIndex];
                if(tempValue.productQuantity > 1){
                    tempValue.productQuantity = tempValue.productQuantity-1
                    tempState.items[productIndex] = {...tempValue}
                }else{
                    const newProductList = tempState.items.filter((item) => item.productID !== productInfo.productID);
                    tempState.items = newProductList;
                }
            }
            break;
        case 'cart:remove':
            if(productIndex >= 0){
                const newProductList = tempState.items.filter((item) => item.productID !== productInfo.productID);
                tempState.items = newProductList;
            }
            break;
        case 'cart:empty':
            tempState = {items:[]}
            break;        
        default:         
    }
    localStorage.setItem('cartItems',JSON.stringify(tempState));
    return tempState;
}

export const addToCart = (productInfo) => {
    return{
        type:"cart:add",
        payload:productInfo
    };
} 

export const updateQuantityToCart = (productInfo) => {
    return{
        type:"cart:update",
        payload:productInfo
    };
} 

export const removeFromCart = (productInfo) => {
    return{
        type:"cart:remove",
        payload:productInfo
    };
}

export const orderPlcaed = () => {
    return{
        type:"cart:empty",
    };
}