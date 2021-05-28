import React, {useState} from 'react'
import {useSelector,useDispatch} from 'react-redux';
import {Header} from './header';
import {API_URL} from '../constant'
import {changeLoginStatus,orderPlcaed} from './reducers'
import {Toolbar,Container,Grid,Paper,Typography,Button,Accordion,AccordionSummary,AccordionDetails,TextField} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {useClasses,useCheckoutClasses} from './style';
import {
    AddShoppingCartSharp as EmptyCartIcon,
    EmojiEmotions as ThankYouIcon,
    CheckCircleOutline as OrderPlacedIcon
    
} from '@material-ui/icons'

import {Cart} from './cart';

export function Checkout(){
    const classes = useClasses();
    const checkoutClasses = useCheckoutClasses();
    const dispatch = useDispatch();
    const userLoginDetails = useSelector((state) => state.checkLoginStatus);
    const userCartInfo = useSelector((state) => state.GetUserCartInfo);
    const [activeStep,setActiveStep] = useState(userLoginDetails.isLoggedin?'address':'login');
    const [emailProps,setEmailProps] = useState({value:userLoginDetails.isLoggedin?userLoginDetails.userID:'',error:false,helperText:''});
    const [passwordProps,setPasswordProps] = useState({value:'',error:false,helperText:''});
    const [nameProps,setNameProps] = useState({value:'',id:'input-name',label:"Name",name:"name",error:false,helperText:''});
    const [mobileNumberProps,setMobileNumberProps] = useState({value:'',id:'input-mobile-number',label:"Mobile Number",name:"mobile-number",error:false,helperText:''});
    const [addressProps,setAddressProps] = useState({value:'',id:'input-address',label:"Address",name:"address",error:false,helperText:''});
    const [isOrderPlaced,setIsOrderPlaced] = useState(false)

    
    const [alertBoxProps,setAlertBoxProps] = useState({isShow:false,severity:"info",message:""});
    
    const emptyCart = (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper className={checkoutClasses.emptyCartOuterBox}>
                    <div className={checkoutClasses.emptyCartBox}>
                        <EmptyCartIcon className={checkoutClasses.emptyCartIcon}/>
                        <Typography>Missing Cart items?</Typography>
                        <Button variant="contained" color="primary" href="/">Go To Shop</Button>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );

    const orderPlaced = (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper className={checkoutClasses.emptyCartOuterBox}>
                    <div className={checkoutClasses.thankyouMessage}>
                        <div className={classes.grow}></div>
                        <OrderPlacedIcon className={checkoutClasses.thankyouMessageIcon}/><Typography gutterBottom className={checkoutClasses.thankyouMessageText}> You Order has been Placed</Typography>
                        <div className={classes.grow}></div>
                        <Button  color="primary" href="/">Go To Shop</Button>
                    </div>
                    <div className={checkoutClasses.emptyCartBox}>
                        <ThankYouIcon className={checkoutClasses.emptyCartIcon}/>
                        <Typography gutterBottom variant='h6'>Thank you for shopping with us!</Typography>    
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
    
    const handleInputDetails = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        let isError = fieldValue?false:true;
        switch(fieldName){
            case "email":
                const emailPattern = new RegExp(/^[a-zA-Z0-9+_.-]+[@]+[a-zA-Z0-9.-]+[.]+[a-zA-Z0-9.-]+$/i);
                let tempEmailProps = emailProps;
                tempEmailProps.helperText = '';
                if(e.type === "blur" && !emailPattern.test(fieldValue)){
                    isError = true;
                    tempEmailProps.helperText = 'Please enter valid Email ID';
                }
                tempEmailProps.value = fieldValue;
                tempEmailProps.error = isError;
                setEmailProps({...tempEmailProps});
                
                break;
            case "password":
                let tempPasswordProps = passwordProps;
                tempPasswordProps.helperText = '';
                if(e.type === "blur" && fieldValue === ''){
                    isError = true;
                    tempPasswordProps.helperText = 'Please enter valid password';
                }
                tempPasswordProps.value = fieldValue;
                tempPasswordProps.error = isError;
                setPasswordProps({...tempPasswordProps});
                break;
            case "name":
                let tempNameProps = nameProps;
                tempNameProps.helperText = '';
                if(e.type === "blur" && fieldValue === ''){
                    isError = true;
                    tempNameProps.helperText = 'Please enter valid Name';
                }
                tempNameProps.value = fieldValue;
                tempNameProps.error = isError;
                setNameProps({...tempNameProps});
                break;
            case "mobile-number":
                let tempMobileNumberProps = mobileNumberProps;
                tempMobileNumberProps.helperText = '';
                if(e.type === "blur" && fieldValue === ''){
                    isError = true;
                    tempMobileNumberProps.helperText = 'Please enter valid Mobile Number';
                }
                if(fieldValue.length <= 10 || mobileNumberProps.value.length < 10){
                    tempMobileNumberProps.value = fieldValue;
                }
                tempMobileNumberProps.error = isError;
                setMobileNumberProps({...tempMobileNumberProps});
                break; 
            case "address":
                let tempAddressProps = addressProps;
                tempAddressProps.helperText = '';
                if(e.type === "blur" && fieldValue === ''){
                    isError = true;
                    tempAddressProps.helperText = 'Please enter valid Address';
                }
                tempAddressProps.value = fieldValue;
                tempAddressProps.error = isError;
                setAddressProps({...tempAddressProps});
                break;           
            default:    
        }
    }

    const checkLoginDetails = (e) => {
        let isValidate = true;
        if (emailProps.value === "") {
            let tempEmailProps = emailProps;
            tempEmailProps.helperText = 'Please enter valid Email ID';
            tempEmailProps.error = true;
            setEmailProps({...tempEmailProps});
            isValidate = false;
        }

        if (passwordProps.value === "") {
            let tempPasswordProps = passwordProps;
            tempPasswordProps.error = true;
            setPasswordProps({...tempPasswordProps});
            isValidate = false;
        }

        if(isValidate){
            let isStatusOK = false;
            let apiEndPoint = API_URL+'check-login';
            let newFormData = new FormData();
            newFormData.append("password",passwordProps.value)
            newFormData.append("userID",emailProps.value)

            const requestOptions = {
                method: 'POST',
                body: newFormData,
            };
            fetch(apiEndPoint, requestOptions)
                .then((response) => {
                    const data = response.json();
                    isStatusOK = response.status === 200 ?true:false;
                    return data;
                })
                .then((data) => {
                    
                    if(isStatusOK){
                        dispatch(changeLoginStatus(data.content));
                        setActiveStep('address');
                    }else{
                        let tmpValues = alertBoxProps;
                        tmpValues.isShow = true;
                        tmpValues.message = isStatusOK?"Login Successfull":data.error;               
                        tmpValues.severity =  isStatusOK?"success":"error";
                        setAlertBoxProps({...tmpValues});
                    }
                });
        }
        e.preventDefault();
    }

    const checkDeliveryDetails = (e) => {
        let isValidate = true;
        if (nameProps.value === "") {
            let tempProps = nameProps;
            tempProps.helperText = 'Please enter valid Name';
            tempProps.error = true;
            setNameProps({...tempProps});
            isValidate = false;
        }

        if (mobileNumberProps.value === "") {
            let tempProps = mobileNumberProps;
            tempProps.helperText = 'Please enter valid Mobile Number';
            tempProps.error = true;
            setMobileNumberProps({...tempProps});
            isValidate = false;
        }

        if (addressProps.value === "") {
            let tempProps = addressProps;
            tempProps.helperText = 'Please enter valid Address';
            tempProps.error = true;
            setAddressProps({...tempProps});
            isValidate = false;
        }

        if(isValidate){
            setActiveStep('summary');
        }
        e.preventDefault();
    }

    const placeUserOrder = () => {
        if(userCartInfo.items.length > 0){
            let isValidate = true;
            if(isValidate){
                let isStatusOK = false;
                let apiEndPoint = API_URL+'place-order/'+userLoginDetails.userID;
                
                let inputJsonForOrder={
                    name:  nameProps.value,
                    email:  emailProps.value,
                    mobileNumber:  Number(mobileNumberProps.value),
                    address:  addressProps.value,
                    userOrderInfo:  userCartInfo.items,
                }
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify(inputJsonForOrder),
                };
                fetch(apiEndPoint, requestOptions)
                    .then((response) => {
                        const data = response.json();
                        isStatusOK = response.status === 200 ?true:false;
                        return data;
                    })
                    .then((data) => {
                        console.log(isStatusOK)
                        if(isStatusOK){
                            dispatch(orderPlcaed());
                            setIsOrderPlaced(true)
                            console.log(isOrderPlaced)
                        }else{
                            let tmpValues = alertBoxProps;
                            tmpValues.isShow = true;
                            tmpValues.message = data.error;               
                            tmpValues.severity =  isStatusOK?"success":"error";
                            setAlertBoxProps({...tmpValues});
                        }
                    });
            }
            
        }
    }
    const handleCloseAlert = (e) => {
        let tmpValues = alertBoxProps;
        tmpValues.isShow = false;
        setAlertBoxProps({...tmpValues});
    }
    return (
        <>
            <Header showLogoOnly={true} />
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                {isOrderPlaced?<>{orderPlaced}</>:
                <>{userCartInfo.items.length === 0?
                    <>{emptyCart}</>
                    : 
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={10} md={8}>
                            <Paper className={checkoutClasses.outerBox}>
                            <Accordion expanded={activeStep==='login'}>
                                <AccordionSummary
                                    aria-controls="login"
                                    id="login"
                                    className={(activeStep==='login'?checkoutClasses.activeHeader:'')}
                                >
                                    <Typography gutterBottom className={classes.heading}>{userLoginDetails.isLoggedin?'LOGGEDIN':'LOGIN OR SIGNUP'}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={6}>
                                            <TextField type="email" id="input-email" className={checkoutClasses.inputBox}  label="Email" variant="standard" name="email" {...emailProps} onChange={(e) => handleInputDetails(e)} onBlur={(e) => handleInputDetails(e)} />
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={6}>
                                            <TextField type="password" id="input-password" className={checkoutClasses.inputBox}  label="Password" variant="standard" name="password" {...passwordProps} onChange={(e) => handleInputDetails(e)} onBlur={(e) => handleInputDetails(e)} />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} className={checkoutClasses.continueButtonBox}>
                                            <div className={classes.grow}> </div>
                                            <Button variant="contained" className={checkoutClasses.continueButton}onClick={(e) => checkLoginDetails(e)}>Continue</Button>
                                        </Grid>
                                    </Grid>    
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={activeStep==='address'}>
                                <AccordionSummary
                                aria-controls="address"
                                id="address"
                                className={(activeStep==='address'?checkoutClasses.activeHeader:'')}
                                >
                                <Typography gutterBottom className={classes.heading}>DELIVERY ADDRESS</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField type="text"  className={checkoutClasses.inputBox}   variant="standard" {...nameProps} onChange={(e) => handleInputDetails(e)} onBlur={(e) => handleInputDetails(e)} />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField type="number" max={10}  className={checkoutClasses.inputBox}   variant="standard" {...mobileNumberProps} onChange={(e) => handleInputDetails(e)} onBlur={(e) => handleInputDetails(e)} />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <TextField type="text"  className={checkoutClasses.inputBox}   variant="standard" {...addressProps} onChange={(e) => handleInputDetails(e)} onBlur={(e) => handleInputDetails(e)} />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} className={checkoutClasses.continueButtonBox}>
                                            <div className={classes.grow}> </div>
                                            <Button variant="contained" className={checkoutClasses.continueButton}onClick={(e) => checkDeliveryDetails(e)}>Deliver Here</Button>
                                        </Grid>
                                    </Grid>
                   
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={activeStep==='summary'}>
                                <AccordionSummary
                                aria-controls="summary"
                                id="summary"
                                className={(activeStep==='summary'?checkoutClasses.activeHeader:'')}
                                >
                                 <Typography gutterBottom className={classes.heading}>ORDER SUMMARY</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                                        </Grid>
                                        <Cart callingPage='checkout'/>
                                        <Grid item xs={12} sm={12} md={12} className={checkoutClasses.continueButtonBox}>
                                            <div className={classes.grow}> </div>
                                            <Button variant="contained" className={checkoutClasses.continueButton}onClick={(e) => placeUserOrder(e)}>Confirm Order</Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>  
                            </Paper>
                        </Grid>
                    </Grid>
                }</>}
            </Container>       
        </>
    );
}