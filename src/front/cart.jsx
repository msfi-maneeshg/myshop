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


export function Cart(props){
    const classes = useClasses();
    const cartClasses = useCartClasses();
    const userCartInfo = useSelector((state) => state.GetUserCartInfo);
    let productPriceDetail = {mrp:0,discount:0};
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productDetailList,setProductDetailList] = useState({products:[]});

    const handleSnackbarClose = (e) =>{
        let oldProps = snackbarProps;
        oldProps.open = false;
        setSnackbarProps({...oldProps});
    }
    const [snackbarProps,setSnackbarProps] = useState({open:false,message:'',severity:'info'})
    
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
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let productIDs = [];
            userCartInfo.items.map((info) => (
                productIDs.push(info.productID)
            ))

            let apiUrl = API_URL+'product-list/'+productIDs.join(',')
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setProductDetailList({products:data.content});
                }else{
                    setProductDetailList({products:[]});
                }
            });
        }
    })

    let totalMrp = 0;
    let totalDiscount = 0;
    userCartInfo.items.forEach(item => {
        if(productDetailList.products.length > 0){
            let productDetails = productDetailList.products.filter((productInfo) => item.productID === productInfo.productID)
            let finalMRP = productDetails[0].productPrize;
            let finalDiscount = 0;
            if (productDetails[0].productDiscount>0){
                finalDiscount = productDetails[0].productPrize * (productDetails[0].productDiscount)/100
            }
            finalDiscount = parseFloat(finalDiscount).toFixed(0);
            finalDiscount = finalDiscount * item.productQuantity
            finalMRP = finalMRP * item.productQuantity
            
            totalMrp = totalMrp + finalMRP
            totalDiscount = totalDiscount + finalDiscount
        }
    });
    productPriceDetail = {mrp:totalMrp,discount:totalDiscount}

    let cartProductList = emptyCart;
    if(productDetailList.products && productDetailList.products.length >0){
        cartProductList = userCartInfo.items.map((item,index) => (
            <Grid key={index} item xs={12} className={cartClasses.heading} >
                <CartProductInfo onClose={() => handleSnackbarClose()} snackbarProps={snackbarProps}  setSnackbarProps={setSnackbarProps} productInfo={productDetailList.products.filter((productInfo) => item.productID === productInfo.productID)} {...item}/>  
                <hr/>
            </Grid>
        ))
    }
    if (props.callingPage === 'checkout'){
        return userCartInfo.items.length === 0?emptyCart:cartProductList;
    }
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
                                        <hr/>
                                    </Grid>
                                    {cartProductList}    
                                    <Grid item xs={12} className={cartClasses.placeOrderBox} >
                                        <Button variant="contained" color="primary" href="/">Want to Shop more!</Button>
                                        <div style={{flexGrow:'1'}}></div>
                                        <Button variant="contained" className={cartClasses.placeOrderButtons} href="/checkout">Place Order</Button>
                                    </Grid>
                                    
                                </Grid>    
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} >
                            <Paper className={cartClasses.outerBox}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} className={classes.productNameBox} >
                                        <Typography variant='h5' gutterBottom>Price Details</Typography>
                                        <hr/>
                                    </Grid>
                                    <Grid item xs={12} className={cartClasses.totalMRPDetailBox} >
                                        <Typography variant='h6' gutterBottom>Price ({userCartInfo.items.length} {userCartInfo.items.length>1?'items':'item'}) </Typography>
                                        <div style={{flexGrow:'1'}}></div>
                                        <Typography variant='h6' gutterBottom>{CURRENCY_SYMBOL}{productPriceDetail.mrp}</Typography>
                                    </Grid>
                                    <Grid item xs={12} className={cartClasses.totalDiscountDetailBox} >
                                        <Typography variant='h6' gutterBottom>Discount</Typography>
                                        <div style={{flexGrow:'1'}}></div>
                                        <Typography variant='h6' gutterBottom className={cartClasses.totalDiscount}>-{CURRENCY_SYMBOL}{productPriceDetail.discount}</Typography>
                                    </Grid>
                                    <Grid item xs={12} className={cartClasses.totalPriceDetailBox} >
                                        <Typography variant='h5' gutterBottom>Total Amount</Typography>
                                        <div style={{flexGrow:'1'}}></div>
                                        <Typography variant='h5' gutterBottom>{CURRENCY_SYMBOL}{productPriceDetail.mrp-productPriceDetail.discount}</Typography>
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
    const productDetails = props.productInfo[0];
    const dispatch = useDispatch();
    const cartClasses = useCartClasses();
    const productQuantity = props.productQuantity;

    let finalPrize = productDetails.productPrize;
    let totalDiscount = 0;
    if (productDetails.productDiscount>0){
        totalDiscount = productDetails.productPrize * (productDetails.productDiscount)/100
        finalPrize = finalPrize - totalDiscount
    }
  

    const updateQuantity = (action) => {
        let newQuantity = productQuantity
        if(action === 'add'){
            newQuantity = newQuantity +1
        }else if(action === 'remove'){
            newQuantity = newQuantity -1
        }

        dispatch(updateQuantityToCart({productID:props.productID,productQuantity:newQuantity}))

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
                            <IconButton aria-label="remove-quantity" color="primary" onClick={() => updateQuantity('remove')} disabled={productQuantity<=1?true:false}><RemoveQuantityIcon/></IconButton>   
                            {productQuantity}
                            <IconButton aria-label="add-quantity1" color="primary" onClick={() => updateQuantity('add')} disabled={productQuantity>=5?true:false}><AddQuantityIcon/></IconButton>
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
                        <span className={cartClasses.productPrize}>{CURRENCY_SYMBOL}{parseFloat(finalPrize).toFixed(0)*productQuantity}</span>
                        {productDetails.productDiscount>0 &&
                            <><span className={cartClasses.productMRP}>{CURRENCY_SYMBOL}{productDetails.productPrize*productQuantity}</span>
                            <span className={cartClasses.productDiscount}>{productDetails.productDiscount}% off</span></>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={() => removeItemFromCart()}>Remove</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Snackbar open={props.snackbarProps.open} autoHideDuration={10}>
            <Alert onClose={() => props.onClose()} severity={props.snackbarProps.severity}>
                {props.snackbarProps.message}
            </Alert>
        </Snackbar>
        </>
    );
}