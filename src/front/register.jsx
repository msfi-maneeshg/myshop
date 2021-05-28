import React,{useState} from 'react'
import clsx from 'clsx';
import {Alert} from '@material-ui/lab';
import {
    Grid,InputAdornment,IconButton,Avatar,
    Typography,Button,TextField,
    Toolbar,Container, Paper,
} from '@material-ui/core';
import {Visibility,VisibilityOff} from '@material-ui/icons';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {useSelector } from 'react-redux'
import {API_URL} from '../constant'
import {useClasses,useLoginStyles} from './style'
import {Header} from './header'
import {Link,useHistory} from 'react-router-dom'
import {
    CheckCircleOutline as OrderPlacedIcon
} from '@material-ui/icons'

export function Register(props){
    const history = useHistory();
    const classes = useClasses(); 
    const loginClasses = useLoginStyles();
    const [userName,setUserName] = useState({type:'text',id:'input-name',label:'Name',name:'name',variant:'standard',value:'',error:false,helperText:''});
    const [userEmail,setUserEmail] = useState({type:'email',id:'input-email',label:'Email',name:'email',variant:'standard',value:'',error:false,helperText:''});
    const [userPassword,setUserPassword] = useState({type:'password',id:'input-password',label:'Password',name:'password',variant:'standard',value:'',error:false,helperText:'',visibility:false});
    const [userConfirmPassword,setUserConfirmPassword] = useState({type:'password',id:'input-confirm-password',label:'Confirm Password',name:'confirm-password',variant:'standard',value:'',error:false,helperText:'',visibility:false});
    const [alertBoxProps,setAlertBoxProps] = useState({isShow:false,severity:"info",message:""});
    const [registerStatus, setRegisterStatus] = useState(false);
    const loginStatus = useSelector((state) => state.checkLoginStatus);
    if (loginStatus.isLoggedin){
        history.push('/')
    }

    const handleClickShowPassword = (value) => {
        let tempProps;
        if(value === 'password'){
            tempProps = userPassword;
            tempProps.visibility = !tempProps.visibility
            tempProps.type = tempProps.visibility?'text':'password'
            setUserPassword({...tempProps})
            console.log(value,userPassword.visibility)
        }else if(value === 'confirm-password'){
            tempProps = userConfirmPassword;
            tempProps.visibility = !tempProps.visibility
            tempProps.type = tempProps.visibility?'text':'password'
            setUserConfirmPassword({...tempProps})
        }
    };

    const checkDetails = (e) => {
        let isValidate = true;
        let tempProps; 
        if(userName.value === ''){
            tempProps = userName;
            tempProps.helperText = 'Please enter valid Name';
            tempProps.error = true;
            setUserName({...tempProps});
            isValidate= false
                
        }
        
        if (userEmail.value  === ''){  
            tempProps = userEmail;
            tempProps.helperText = 'Please enter valid Email ID';
            tempProps.error = true;
            setUserEmail({...tempProps});
            isValidate= false
        }
        
        if (userPassword.value  === ''){  
            tempProps = userPassword;
            tempProps.helperText = 'Please enter valid password';
            tempProps.error = true;
            setUserPassword({...tempProps});
            isValidate= false
            
        }
        
        if (userConfirmPassword.value === ''){  
            tempProps = userConfirmPassword;
            tempProps.helperText = 'Please enter confirm Password';
            tempProps.error = true;
            setUserConfirmPassword({...tempProps});
            isValidate= false
        }   
        
        if (userPassword.value && userConfirmPassword.value && userPassword.value !== userConfirmPassword.value){
            let tmpValues = alertBoxProps;
            tmpValues.isShow = true;
            tmpValues.message = 'Password not matching';       
            tmpValues.severity =  'error';
            setAlertBoxProps({...tmpValues});
            isValidate= false
        }
            

        if(isValidate){
            let isStatusOK = false;
            let apiEndPoint = API_URL+'register';
            let newFormData = new FormData();
            
            newFormData.append("userName",userName.value)
            newFormData.append("userEmail",userEmail.value)
            newFormData.append("password",userPassword.value)
            newFormData.append("confirmPassword",userConfirmPassword.value)

            const requestOptions = {
                method: 'POST',
                body: newFormData,
            };
            fetch(apiEndPoint, requestOptions)
                .then((response) => {
                    const data = response.json();
                    isStatusOK = response.status === 200 ?true:false;
                    if(!data){
                        let tmpValues = alertBoxProps;
                        tmpValues.isShow = true;
                        tmpValues.message = 'Something went wrong!';         
                        tmpValues.severity =  "error";
                        setAlertBoxProps({...tmpValues});
                    }

                    return data   ;
                })
                .then((data) => {
                    let tmpValues = alertBoxProps;
                    tmpValues.isShow = true;
                    if(isStatusOK){
                        tmpValues.message = "Register Successfull"
                        setRegisterStatus(true);
                    }else{
                        tmpValues.message = data.error?data.error:'Something went wrong!';
                    }
                                 
                    tmpValues.severity =  isStatusOK?"success":"error";
                    setAlertBoxProps({...tmpValues});
                });
        }
        e.preventDefault();
    }

    const handleCloseAlert = (e) => {
        let tmpValues = alertBoxProps;
        tmpValues.isShow = false;
        setAlertBoxProps({...tmpValues});
    }

    const handleLoginDetails = (e) =>{
        let tempProps;
        let tmpValues;
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        let isError = fieldValue?false:true;
        switch(fieldName){
            case "name":
                tempProps = userName;
                tempProps.helperText = '';
                if(fieldValue === ''){
                    isError = true;
                    tempProps.helperText = 'Please enter valid Name';
                }
                tempProps.value = fieldValue;
                tempProps.error = isError;
                setUserName({...tempProps});
                
                break;    
            case "email":
                const emailPattern = new RegExp(/^[a-zA-Z0-9+_.-]+[@]+[a-zA-Z0-9.-]+[.]+[a-zA-Z0-9.-]+$/i);
                tempProps = userEmail;
                tempProps.helperText = '';
                if((e.type === "blur" && !emailPattern.test(fieldValue)) || fieldValue === ''){
                    isError = true;
                    tempProps.helperText = 'Please enter valid Email ID';
                }
                tempProps.value = fieldValue;
                tempProps.error = isError;
                setUserEmail({...tempProps});
                break;
            case "password":
                tempProps = userPassword;
                tempProps.helperText = '';
                if(fieldValue === ''){
                    isError = true;
                    tempProps.helperText = 'Please enter valid password';
                }
                tempProps.value = fieldValue;
                tempProps.error = isError;
                setUserPassword({...tempProps});

                tmpValues = alertBoxProps;
                tmpValues.isShow = false;
                setAlertBoxProps({...tmpValues}); 
                break;  
            case "confirm-password":
                tempProps = userConfirmPassword;
                tempProps.helperText = '';
                if(fieldValue === ''){
                    isError = true;
                    tempProps.helperText = 'Please enter confirm Password';
                }
                tempProps.value = fieldValue;
                tempProps.error = isError;
                setUserConfirmPassword({...tempProps});
                
                tmpValues = alertBoxProps;
                tmpValues.isShow = false;
                setAlertBoxProps({...tmpValues});
                break;          
            default:    
        }
    } 

    if(registerStatus){
        return (
            <div className={loginClasses.paper}>
                <div className={loginClasses.thankyouMessage}>
                    <div className={classes.grow}></div>
                    <OrderPlacedIcon className={loginClasses.thankyouMessageIcon}/><Typography gutterBottom className={loginClasses.thankyouMessageText}>You are register Now!</Typography>
                    <div className={classes.grow}></div>
                    
                </div>
                <Button  color="primary" href="/login">Go To Login Page</Button>
            </div>            
        );
    }
    return (
        <div className={loginClasses.paper}>
                {props.isPopup && 
                    <><Grid item xs={12}>
                        <Avatar className={loginClasses.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            MyShop
                        </Typography>
                    </Grid></>
                }
                <form className={loginClasses.form} noValidate onSubmit={(e) => checkDetails(e)}>
                    <Grid item xs={12} >
                    {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                    </Grid>
                    <Grid item xs={12} >
                        <TextField className={clsx(loginClasses.inputBox)} {...userName}  onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField  className={clsx(loginClasses.inputBox)} {...userEmail}   onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField className={clsx(loginClasses.inputBox)} {...userPassword} onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={() =>handleClickShowPassword('password')}
                                edge="end"
                                >
                                {userPassword.visibility ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            ),
                          }}/>
                    </Grid>
                    <Grid item xs={12} >
                        <TextField className={clsx(loginClasses.inputBox)} {...userConfirmPassword} onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton
                                onClick={() => handleClickShowPassword('confirm-password')}
                                edge="end"
                                >
                                {userConfirmPassword.visibility ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            ),
                          }}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={loginClasses.submit}
                        >
                            Register
                        </Button>
                    </Grid>
                    
                </form>
                <Grid item xs={12}>
                    <Link to='/login' className={classes.link}>
                        <Typography variant="caption" gutterBottom>Existing User? Log in</Typography>
                    </Link>
                </Grid>            
            </div>            
    );
}

export function RegisterPage(){
    const classes = useClasses(); 
    const loginClasses = useLoginStyles();
    return (
        <>
            <Header showLogoOnly={true}/>
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                <Grid container>
                    <Grid item sm={12} >
                        <Paper className={loginClasses.loginOuterBox}>
                            <div className={classes.grow}></div>
                            
                                <Register isPopup={true}/>
                            
                            <div className={classes.grow}></div>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            
        </>
    );
}

export default Register;