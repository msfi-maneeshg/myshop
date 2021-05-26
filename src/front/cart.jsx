import {useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Header} from './header';
import {Toolbar,Container,Grid,Paper,Typography,Button,IconButton,Snackbar} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {useClasses,useCartClasses} from './style';
import {API_URL,CURRENCY_SYMBOL} from '../constant';
import {
    AddCircle as AddQuantityIcon,
    RemoveCircle as RemoveQuantityIcon,
    AddShoppingCartSharp as EmptyCartIcon,
} from '@material-ui/icons'
import {updateQuantityToCart,removeFromCart} from './reducers'


export function Cart(){
    const classes = useClasses();
    const cartClasses = useCartClasses();
    const userCartInfo = useSelector((state) => state.GetUserCartInfo);

    const handleSnackbarClose = (e) =>{
        let oldProps = snackbarProps;
        oldProps.open = false;
        setSnackbarProps({...oldProps});

    }
    const [snackbarProps,setSnackbarProps] = useState({open:false,message:'',severity:'info',onClose:handleSnackbarClose})
    
    const emptyCart = (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper className={cartClasses.emptyCartOuterBox}>
                    <Typography variant='h5' gutterBottom>My Cart</Typography>
                    <div className={cartClasses.emptyCartBox}>
                        <EmptyCartIcon className={cartClasses.emptyCartIcon}/>
                        <Typography>Missing Cart items?</Typography>
                        <Button variant="contained" color="primary" href="/">Go To Shop</Button>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
    

    return (
        <>
            <Header />
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                {userCartInfo.items.length === 0?
                    <>{emptyCart}</>
                    : 
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8} md={8}>
                            <Paper className={cartClasses.outerBox}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} className={cartClasses.heading} >
                                        <Typography variant='h5' gutterBottom>My Cart ({userCartInfo.items.length})</Typography>
                                    </Grid>
                                    <Grid item xs={12} className={cartClasses.heading} >
                                        <hr/>
                                    </Grid>
                                    {userCartInfo.items.map((info,index) => (
                                    
                                        <Grid key={index} item xs={12} className={cartClasses.heading} >
                                            <CartProductInfo snackbarProps={snackbarProps} {...info} setSnackbarProps={setSnackbarProps}/>   
                                        
                                            <hr/>
                                        </Grid>
                                
                                    ))}
                                    <Grid item xs={12} className={cartClasses.placeOrderBox} >
                                        <div style={{flexGrow:'1'}}></div>
                                        <Button variant="contained" className={cartClasses.placeOrderButtons} href="/my-cart">Place Order</Button>
                                    </Grid>
                                    
                                </Grid>    
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} >
                            <Paper className={cartClasses.outerBox}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} className={classes.productNameBox} >
                                        <Typography variant='h5' gutterBottom>PRICE DETAILS</Typography>
                                    </Grid>
                                    <Grid item xs={12} className={classes.productNameBox} >
                                        <ul>
                                        {userCartInfo.items.map((info,index) => (
                                            <li key={index}>{info.productID} : {info.productQuantity}</li>
                                        ))}
                                        </ul>
                                    </Grid>
                                </Grid>    
                            </Paper>
                        </Grid>    
                    </Grid>
                }
            </Container>       
        </>
    );
}

function CartProductInfo(props){
    const dispatch = useDispatch();
    const cartClasses = useCartClasses();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productDetails,setProductDetails] = useState({});
    const [productQuantity,setProductQuantity] = useState(props.productQuantity);
    let removeButton = props.productQuantity > 1 ?false:true;
    const [addQuantityButtonProps,setAddQuantityButtonProps] =  useState({disabled :false});
    const [removeQuantityButtonProps,setRemoveQuantityButtonProps] =  useState({disabled :removeButton});
    
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let apiUrl = API_URL+'product-detail/'+props.productID
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setProductDetails({...data.content});
                }else{
                    setProductDetails({});
                }
            });
        }
    })

    const updateQuantity = (action) => {
        let tempRemoveProps = removeQuantityButtonProps;
        let tempAddProps = addQuantityButtonProps;
        let newQuantity = productQuantity
        if(action === 'add'){
            newQuantity = newQuantity +1
        }else if(action === 'remove'){
            newQuantity = newQuantity -1
        }
        setProductQuantity(newQuantity);
       
        tempRemoveProps.disabled = newQuantity <= 1?true:false;
        tempAddProps.disabled = newQuantity >= 5?true:false;
        setRemoveQuantityButtonProps({...tempRemoveProps});
        setAddQuantityButtonProps({...tempAddProps});

        dispatch(updateQuantityToCart({productID:props.productID,productQuantity:newQuantity}))

        console.log(props.snackbarProps);
        let oldProps = props.snackbarProps;
        oldProps.open = true;
        oldProps.severity = 'success';
        oldProps.message = "you've changed '"+productDetails.productName+"' QUANTITY to "+newQuantity;
        props.setSnackbarProps({...oldProps});
    }

    

    const removeItemFromCart = () => {
        let oldProps = props.snackbarProps;
        oldProps.open = true;
        oldProps.severity = 'success';
        oldProps.message = "Successfully removed '"+productDetails.productName+"' from your cart";
        props.setSnackbarProps({...oldProps});
        dispatch(removeFromCart({productID:props.productID}))
    }

    let finalPrize = productDetails.productPrize;
    if (productDetails.productDiscount>0){
        finalPrize = productDetails.productPrize * (100-productDetails.productDiscount)/100;
    }

    return (
        <>
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <div className={cartClasses.imageBox}>
                            {productDetails.productImage && <img src={API_URL + 'image/'+productDetails.productImage[0].imageName} alt={productDetails.productImage[0].imageName} className={cartClasses.productImage}/>}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={cartClasses.quantityButtons}>
                            <IconButton aria-label="remove-quantity" color="primary" onClick={() => updateQuantity('remove')} {...removeQuantityButtonProps}><RemoveQuantityIcon/></IconButton>   
                            {productQuantity}
                            <IconButton aria-label="add-quantity1" color="primary" onClick={() => updateQuantity('add')} {...addQuantityButtonProps}><AddQuantityIcon/></IconButton>
                        </div> 
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={8}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant='h5' gutterBottom>{productDetails.productName}</Typography>                     
                    </Grid>
                    <Grid item xs={12} className={cartClasses.productPrizeBox} >
                        <span className={cartClasses.productPrize}>{CURRENCY_SYMBOL}{parseFloat(finalPrize).toFixed(0)}</span>
                        {productDetails.productDiscount>0 &&
                            <><span className={cartClasses.productMRP}>{CURRENCY_SYMBOL}{productDetails.productPrize}</span>
                            <span className={cartClasses.productDiscount}>{productDetails.productDiscount}% off</span></>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={() => removeItemFromCart()}>Remove</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Snackbar open={props.snackbarProps.open} autoHideDuration={3000} {...props.onClose}>
            <Alert {...props.onClose} severity={props.snackbarProps.severity}>
                {props.snackbarProps.message}
            </Alert>
        </Snackbar>
        </>
    );
}