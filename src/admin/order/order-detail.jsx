import React ,{useState,useEffect}from 'react';
import {useStyles,useOrderListStyle} from '../common'
import {Header} from '../header'
import {Sidebar} from '../sidebar'
import clsx from 'clsx';
import {CURRENCY_SYMBOL} from '../../constant'
import {Alert} from '@material-ui/lab';
import {
    Button,
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
    TableContainer,Table,TableHead,TableRow,TableCell,TableBody,TableFooter,
    Stepper,Step,StepLabel,
} from '@material-ui/core';
import { useParams } from 'react-router';

export function OrderDetails() {
    const {orderID} = useParams();
   
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [ordersDetails,setOrdersDetails] = useState(null); 
    const [orderCurrentStatus,setOrderCurrentStatus] = useState(0);
    const [alertBoxProps,setAlertBoxProps] = useState({isShow:false,severity:"info",message:""});
    
    
    const classes = useStyles();
    const orderClasses = useOrderListStyle();
    
    let orderStatusSteps = [
        {label:"Order Placed",isCompleted:true,isValid:true},
        {label:"Approved",isCompleted:true,isValid:true},
        {label:"Shipped",isCompleted:false,isValid:true},
        {label:"Delivered",isCompleted:false,isValid:true},
    ];

    const orderTableHead = [
        { id: 'productName', label: 'Product Name',align:"left" },
        { id: 'prize', label: 'Prize',align:"right" },
        { id: 'discount', label: 'Discount',align:"right" },
        { id: 'quantity', label: 'Quantity',align:"right" },
        { id: 'subTotal', label: 'Sub Total',align:"right" },
    ];

    if(orderCurrentStatus === 5 ){
        orderStatusSteps = [
            {label:"Order Placed",isCompleted:true,isValid:true},
            {label:"Rejected",isCompleted:true,isValid:false},
        ];
    }else if( orderCurrentStatus === 6){
        orderStatusSteps = [
            {label:"Order Placed",isCompleted:true,isValid:true},
            {label:"Cancelled",isCompleted:true,isValid:false},
        ];
    }

    const handleCloseAlert = (e) => {
        let tmpValues = alertBoxProps;
        tmpValues.isShow = false;
        setAlertBoxProps({...tmpValues});
    }
  

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            let apiUrl = 'http://localhost:8000/admin/order-details/'+orderID;

            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setOrdersDetails(data.content);
                    setOrderCurrentStatus(data.content.orderStatusID)
                }else{
                    let tmpValues = alertBoxProps;
                    tmpValues.isShow = true;
                    tmpValues.message = data.error;                
                    tmpValues.severity =  isStatusOK?"success":"error";
                    setAlertBoxProps({...tmpValues});
                }
            });
        }
    })

    const UpdateOrderStatus = (orderStatus) => {
        let isStatusOK = false;
        let updateData  = new FormData();
        updateData.append("orderID",orderID);
        updateData.append("orderStatus",orderStatus);
        const requestOptions = {
            method: 'UPDATE',
            body: updateData,
        };
        let apiUrl = 'http://localhost:8000/admin/order-status';

        fetch(apiUrl, requestOptions)
        .then((response) => {
            const data = response.json()
            isStatusOK = response.status;
            return data   
        })
        .then((data) => {
            setIsDataLoaded(true)
            let tmpValues = alertBoxProps;
            tmpValues.isShow = true;
            tmpValues.message = isStatusOK?data.content:data.error;                
            tmpValues.severity =  isStatusOK?"success":"error";
            setAlertBoxProps({...tmpValues});
            if(isStatusOK){
                setIsDataLoaded(false);
            }
        });
    }
  
    let orderActionButton;
    switch(orderCurrentStatus){
        case 1:
            orderActionButton = (<><Button onClick={() => UpdateOrderStatus('2')} className={orderClasses.orderActionButton} variant="outlined" color="primary">Approved</Button>
            <Button onClick={() => UpdateOrderStatus('5')} className={orderClasses.orderActionButton} variant="outlined" color="secondary">Rejected</Button></>);
            break;
        case 2:
            orderActionButton = (<Button onClick={() => UpdateOrderStatus('3')} className={orderClasses.orderActionButton} variant="outlined" color="primary">Shipped</Button>);
            break;
        case 3:
            orderActionButton = (<Button onClick={() => UpdateOrderStatus('4')} className={orderClasses.orderActionButton} variant="outlined" color="primary">Delivered</Button>);
            break;        
        default:

    }
    
  return (
    <div className={classes.root}>
        <Header />
        <Sidebar {...{menu:'order'}} />
        <main className={classes.content}>
            <Toolbar />
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item xs={12}>
                        <Paper className={classes.innerHeader}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Order Details</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={orderClasses.paperBox}>
                            <Grid container>
                                <Grid item xs={12}>
                                {alertBoxProps.isShow?<Alert className={orderClasses.alertBox} severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper>
                                        <Stepper alternativeLabel activeStep={Number(orderCurrentStatus)-1} >
                                            {orderStatusSteps.map((stepInfo,index) => (
                                                <Step key={index}>
                                                    <StepLabel error={!stepInfo.isValid}>{stepInfo.label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={clsx(orderClasses.detailsBox,orderClasses.orderDetailsBox)}>
                                        <Grid container>
                                            <Grid item xs={4}>Order ID</Grid><Grid item xs={8}>: {ordersDetails && orderID}</Grid>
                                            <Grid item xs={4}>Order Date</Grid><Grid item xs={8}>: {ordersDetails && ordersDetails.orderDate}</Grid>
                                            <Grid item xs={4}>Order Status</Grid><Grid item xs={8}>: {ordersDetails && ordersDetails.orderStatus}</Grid>
                                            <Grid item xs={12}>
                                                {orderActionButton}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={clsx(orderClasses.detailsBox,orderClasses.shippingDetailsBox)}>
                                        <Grid container>
                                            <Grid item xs={5}>Customer Name</Grid><Grid item xs={7}>: {ordersDetails && ordersDetails.username}</Grid>
                                            <Grid item xs={5}>Email Address</Grid><Grid item xs={7}>: {ordersDetails && ordersDetails.emailID}</Grid>
                                            <Grid item xs={5}>Phone Number</Grid><Grid item xs={7}>: {ordersDetails && ordersDetails.phone}</Grid>
                                            <Grid item xs={5}>Address</Grid><Grid item xs={7}>: {ordersDetails && ordersDetails.shippingAddress}</Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Paper style={{width: '100%' }}>
                                <TableContainer style={{maxHeight: '50vh' }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                {orderTableHead.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    align={headCell.align}
                                                >
                                                    {headCell.label}
                                                </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {ordersDetails && ordersDetails.productList &&           
                                        ordersDetails.productList.map((productInfo,index)=>(
                                            <TableRow hover key={index}>
                                                <TableCell align="left">{productInfo.productName}</TableCell>
                                                <TableCell align="right">{CURRENCY_SYMBOL}{parseFloat(productInfo.prize).toFixed(2)}</TableCell>
                                                <TableCell align="right">{parseFloat(productInfo.discount).toFixed(2)}%</TableCell>
                                                <TableCell align="right">{productInfo.quantity}</TableCell>
                                                <TableCell align="right">{CURRENCY_SYMBOL}{parseFloat(productInfo.prize * productInfo.quantity* ((100-productInfo.discount)/100)).toFixed(2)}</TableCell>
                                                
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                        <TableCell colSpan={2}></TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="right">{ordersDetails?ordersDetails.totalQuantity:""}</TableCell>
                                        <TableCell align="right">{ordersDetails?CURRENCY_SYMBOL+parseFloat(ordersDetails.totalPayment).toFixed(2):""}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </main>
    </div>
  );
} 
