import React,{useState} from 'react'
import clsx from 'clsx';
import {Alert} from '@material-ui/lab';
import {Link,Grid,InputAdornment,IconButton,Avatar,Typography,Button,TextField } from '@material-ui/core';
import {Visibility,VisibilityOff} from '@material-ui/icons';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {useDispatch } from 'react-redux'
import {API_URL} from '../constant'
import {changeLoginStatus} from './reducers'
import {useLoginStyles} from './style'


export function Login(){
    const loginClasses = useLoginStyles();
    const [userEmail,setUserEmail] = useState({value:'',error:false,helperText:''});
    const [userPassword,setUserPassword] = useState({value:'',error:false,helperText:''});
    const [showPassword, setShowPassword] = useState(false);
    const [alertBoxProps,setAlertBoxProps] = useState({isShow:false,severity:"info",message:""});
    const dispatch = useDispatch();
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const checkLogin = (e) => {
        let isValidate = true;
        if (userEmail.value === "") {
            let tempEmailProps = userEmail;
            tempEmailProps.helperText = 'Please enter valid Email ID';
            tempEmailProps.error = true;
            setUserEmail({...tempEmailProps});
            isValidate = false;
        }

        if (userPassword.value === "") {
            let tempPasswordProps = userPassword;
            tempPasswordProps.error = true;
            setUserPassword({...tempPasswordProps});
            isValidate = false;
        }

        if(isValidate){
            let isStatusOK = false;
            let apiEndPoint = API_URL+'check-login';
            let newFormData = new FormData();
            newFormData.append("password",userPassword.value)
            newFormData.append("userID",userEmail.value)

            const requestOptions = {
                method: 'POST',
                body: newFormData,
            };
            fetch(apiEndPoint, requestOptions)
                .then((response) => {
                    const data = response.json();
                    isStatusOK = response.status === 200 ?true:false;
                    return data   ;
                })
                .then((data) => {
                    let tmpValues = alertBoxProps;
                    tmpValues.isShow = true;
                    tmpValues.message = isStatusOK?"Login Successfull":data.error;               
                    tmpValues.severity =  isStatusOK?"success":"error";
                    setAlertBoxProps({...tmpValues});
                    if(isStatusOK){
                        dispatch(changeLoginStatus(data.content));
                    }
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
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        let isError = fieldValue?false:true;
        switch(fieldName){
            case "email":
                const emailPattern = new RegExp(/^[a-zA-Z0-9+_.-]+[@]+[a-zA-Z0-9.-]+[.]+[a-zA-Z0-9.-]+$/i);
                let tempEmailProps = userEmail;
                tempEmailProps.helperText = '';
                if(e.type === "blur" && !emailPattern.test(fieldValue)){
                    isError = true;
                    tempEmailProps.helperText = 'Please enter valid Email ID';
                }
                tempEmailProps.value = fieldValue;
                tempEmailProps.error = isError;
                setUserEmail({...tempEmailProps});
                
                break;
            case "password":
                let tempPasswordProps = userPassword;
                tempPasswordProps.value = fieldValue;
                tempPasswordProps.error = isError;
                setUserPassword({...tempPasswordProps});
                break;
            default:    
        }
    } 

    const loginInterface = (
        <div className={loginClasses.paper}>
                <Grid item xs={12}>
                    <Avatar className={loginClasses.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                </Grid>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        MyShop
                    </Typography>
                </Grid>
                <form className={loginClasses.form} noValidate onSubmit={(e) => checkLogin(e)}>
                    <Grid item xs={12} >
                    {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                    </Grid>
                    <Grid item xs={12} >
                        <TextField type="email" id="input-email" className={clsx(loginClasses.inputBox)} {...userEmail} label="Email" variant="outlined" name="email" onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField type={showPassword ? 'text' : 'password'} id="input-password" className={clsx(loginClasses.inputBox)} {...userPassword} name="password" label="Password" variant="outlined" onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
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
                            Login
                        </Button>
                    </Grid>
                    
                </form>   
                <Grid item xs={12}>
                    <Link>
                        <Typography variant="caption" gutterBottom>New to MyShop? Create an account</Typography>
                    </Link>
                </Grid>             
            </div>            
    )

    return loginInterface;
}





export default Login;