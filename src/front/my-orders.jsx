import {useState,useEffect} from 'react'
import {Header} from './header'
import {useClasses,useMyOrderClasses} from './style';
import {Toolbar,Container,Grid,Paper,Typography,Button,CircularProgress,RadioGroup,FormControlLabel,Radio} from '@material-ui/core';
import {CURRENCY_SYMBOL,API_URL} from '../constant'
import {useSelector} from 'react-redux'

export function MyOrders(){
    const orderLimit = 2;
    const classes = useClasses();
    const myOrderClasses = useMyOrderClasses();
    const userLoginDetails = useSelector((state) => state.checkLoginStatus) 
    const [orderType,setOrderType] = useState('all'); 
    const [offset,setOffset] = useState(0); 
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [orderList,setOrderList] = useState({orders:[]});
    const [loadMore ,setLoadMore] = useState(true)

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let apiUrl = API_URL+'order-list/'+userLoginDetails.userID+'/'+orderType+'/'+orderLimit+'/'+offset
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    let tempProps = orderList
                    if(offset === 0){
                        tempProps.orders = data.content.orders
                    }else if (data.content.orders && data.content.orders.length > 0){
                        tempProps.orders = tempProps.orders.concat(data.content.orders)
                    }
                    
                    setOrderList({...tempProps});
                    if (offset >= data.content.totalOrders || data.content.totalOrders <= orderLimit){
                        setLoadMore(false)
                    }
                }else{
                    setOrderList({orders:[]});
                }
            });
        }
    })

    const handleOrdetType = (e) => {
        setLoadMore(true)
        setOrderType(e.target.value)
        setOffset(0)
        setIsDataLoaded(false)
    }

    const loadNextRecords = () => {
        setOffset(offset+orderLimit)
        setIsDataLoaded(false)
    }
    return (
        <>
            <Header />
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Paper className={myOrderClasses.main}>
                            <Typography variant='h5' gutterBottom>My Orders</Typography>
                            <hr/>
                        </Paper>   
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={myOrderClasses.main}>
                            <Typography variant='h5' gutterBottom>Filters</Typography>
                            <hr/>
                            <Grid container spacing={1}>
                                <Grid  item xs={12}>
                                <RadioGroup aria-label="discount" name="discount" value={orderType} onChange={(e) => handleOrdetType(e)}>
                                    <FormControlLabel value="all" control={<Radio   color="primary"/>} label="All" />
                                    <FormControlLabel value="1" control={<Radio  color="primary"/>} label="Pending" />
                                    <FormControlLabel value="2" control={<Radio  color="primary"/>} label="Approved" />
                                    <FormControlLabel value="3" control={<Radio  color="primary"/>} label="Shipped" />
                                    <FormControlLabel value="4" control={<Radio  color="primary"/>} label="Delivered" />
                                </RadioGroup>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container spacing={1}>
                            {orderList.orders && orderList.orders.length > 0 ?
                            <>{orderList.orders.map((orderInfo,index) => (
                                <OrderDetails key={index} {...orderInfo} />
                            ))}
                            
                            </>
                            :
                            <>{isDataLoaded ? <div className={classes.noResultFound}><Typography variant='h5' gutterBottom>Sorry, no order found!</Typography></div>:<div className={classes.ProductListLoading}><CircularProgress /></div>}</>}

                            <Grid item xs={12} className={myOrderClasses.loadMoreBox}>
                            {loadMore && <Button onClick={() => loadNextRecords()} variant="contained" color="primary">{isDataLoaded?'Load More': <CircularProgress style={{color:'white'}} />}</Button>}
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    
                </Grid> 
            </Container>   
        </>
    );
}

function OrderDetails(props){
    const classes = useClasses();
    const myOrderClasses = useMyOrderClasses();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [orderDetails,setOrderDetails] = useState({});

    const [viewAll,setViewAll] = useState(false);

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            let apiUrl = API_URL+'order-details/'+props.orderID
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setOrderDetails({...data.content}); 
                }else{
                    setOrderDetails({});
                }
            });
        }
    })


    const handleViewAll = () => {
        setViewAll(!viewAll)
    }
    return (
        <Grid item xs={12}>
            <Paper className={myOrderClasses.main}>
                <Grid container>
                    <Grid item xs={12} className={classes.flex}>
                        <div>Order Status</div>
                        <div className={classes.grow}></div>
                        <div>Order Total ({orderDetails.productList && <>{orderDetails.productList.length}{orderDetails.productList.length > 1?' items':' item'}</> })</div>
                    </Grid>
                    <Grid item xs={12} className={classes.flex}>
                        <div><Typography variant='h6' gutterBottom>{props.orderStatus}</Typography></div>
                        <div className={classes.grow}></div>
                        <div><Typography variant='h6' gutterBottom>{CURRENCY_SYMBOL}{parseFloat(props.totalPayment).toFixed(2)}</Typography></div>
                    </Grid>
                    <Grid item xs={12}>
                        <hr className={classes.dashed}/>
                        {orderDetails.productList && orderDetails.productList.map((productInfo,index) => (
                            <>{(index === 0 || viewAll) &&
                                <><div className={myOrderClasses.orderDetailsBox}>
                                    <div className={myOrderClasses.productImageBox}>
                                        <img className={myOrderClasses.productImage} alt='product' src={API_URL+'image/'+productInfo.productImage[0].imageName} />        
                                    </div>
                                    <div className={myOrderClasses.productNameBox}>
                                    <Typography variant='h6' gutterBottom>{productInfo.productName}</Typography>
                                    </div>
                                    <div className={classes.grow}></div>
                                    <div className={myOrderClasses.productPrizeBox}>
                                        <Typography variant='h6' gutterBottom>{CURRENCY_SYMBOL}{parseFloat(productInfo.prize * (100 - productInfo.discount) / 100).toFixed(2)}</Typography>
                                    </div>
                                </div>
                                <hr /></> }
                            </>
                        ))}
                    </Grid>
                    {orderDetails.productList && orderDetails.productList.length > 1&&
                    <Grid item xs={12} className={classes.flex}>
                        <Button onClick={handleViewAll} variant="contained" color="primary">{!viewAll?'View All':'View Less'}</Button>
                        <div className={classes.grow}></div>
                    </Grid>   }
                </Grid>
            </Paper>   
        </Grid>
                
    );
}