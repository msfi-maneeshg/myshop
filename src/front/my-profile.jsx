import {useState,useEffect} from 'react'
import {Header} from './header'
import {useClasses,useMyProfileClasses} from './style';
import {IconButton,InputAdornment,Toolbar,Container,Grid,Paper,Typography,Button,TextField} from '@material-ui/core';
import {API_URL} from '../constant'
import {useSelector} from 'react-redux'
import { useHistory } from 'react-router';
import clsx from 'clsx';
import {Alert} from '@material-ui/lab';
import {Visibility,VisibilityOff} from '@material-ui/icons';

export function MyProfile(){
    const history = useHistory();
    const classes = useClasses();
    const myProfileClasses = useMyProfileClasses();
    const userLoginDetails = useSelector((state) => state.checkLoginStatus) 
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [userName,setUserName] = useState({value:'',variant:'outlined',name:'name',label:'Name'})
    const [userPassword,setUserPassword] = useState({type:'password',id:'input-password',label:'Password',name:'password',variant:'outlined',value:'',error:false,helperText:'',visibility:false});
    const [userConfirmPassword,setUserConfirmPassword] = useState({type:'password',id:'input-confirm-password',label:'Confirm Password',name:'confirm-password',variant:'outlined',value:'',error:false,helperText:'',visibility:false});
    const [alertBoxProps,setAlertBoxProps] = useState({name:'info',isShow:false,severity:"info",message:""});
    const [passAlertBoxProps,setPassAlertBoxProps] = useState({name:'pass',isShow:false,severity:"info",message:""});
    

    if (!userLoginDetails.isLoggedin){
        history.push('/')
    }

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let apiUrl = API_URL+'my-profile/'+userLoginDetails.userID
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    let tempProps = userName;
                    tempProps.value = data.content.username;
                    setUserName({...tempProps})
                }
            });
        }
    })

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

    const updateUserInfo = () => {
        let validate = true;
        if (userName.value === ''){
            let tempProps = userName;
            tempProps.helperText = 'Please enter valid Name';
            tempProps.error = true;
            setUserName({...tempProps});
            validate = false;
        }
        if(validate){
            let isStatusOK = false;
            let apiEndPoint = API_URL+'edit-profile';
            let newFormData = new FormData();
            
            newFormData.append("userName",userName.value)
            newFormData.append("userEmail",userLoginDetails.userID)
            
            const requestOptions = {
                method: 'UPDATE',
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
                        tmpValues.message = data.content
                    }else{
                        tmpValues.message = data.error?data.error:'Something went wrong!';
                    }
                                 
                    tmpValues.severity =  isStatusOK?"success":"error";
                    setAlertBoxProps({...tmpValues});
                });
        }
    }

    const updateUserPassword = () => {
        let isValidate = true;
        let tempProps;
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
            let tmpValues = passAlertBoxProps;
            tmpValues.isShow = true;
            tmpValues.message = 'Password not matching';       
            tmpValues.severity =  'error';
            setPassAlertBoxProps({...tmpValues});
            isValidate= false
        }

        if(isValidate){
            let isStatusOK = false;
            let apiEndPoint = API_URL+'change-password';
            let newFormData = new FormData();
            
            newFormData.append("password",userPassword.value)
            newFormData.append("confirmPassword",userConfirmPassword.value)
            newFormData.append("userEmail",userLoginDetails.userID)
            
            const requestOptions = {
                method: 'UPDATE',
                body: newFormData,
            };
            fetch(apiEndPoint, requestOptions)
                .then((response) => {
                    const data = response.json();
                    isStatusOK = response.status === 200 ?true:false;
                    if(!data){
                        let tmpValues = passAlertBoxProps;
                        tmpValues.isShow = true;
                        tmpValues.message = 'Something went wrong!';         
                        tmpValues.severity =  "error";
                        setPassAlertBoxProps({...tmpValues});
                    }
                    return data   ;
                })
                .then((data) => {
                    let tmpValues = passAlertBoxProps;
                    tmpValues.isShow = true;
                    if(isStatusOK){
                        tmpValues.message = data.content

                        let tempProps = userPassword;
                        tempProps.value = '';
                        setUserPassword({...tempProps});

                        tempProps = userConfirmPassword;
                        tempProps.value = '';
                        setUserConfirmPassword({...tempProps});



                    }else{
                        tmpValues.message = data.error?data.error:'Something went wrong!';
                    }
                                 
                    tmpValues.severity =  isStatusOK?"success":"error";
                    setPassAlertBoxProps({...tmpValues});
                });
        }
    }
 
    const handleCloseAlert = (alertID) => {
        let tmpValues;
        if(alertID === 'info'){
            tmpValues = alertBoxProps;
            tmpValues.isShow = false;
            setAlertBoxProps({...tmpValues});
        }else if(alertID === 'pass'){
            tmpValues = passAlertBoxProps;
            tmpValues.isShow = false;
            setPassAlertBoxProps({...tmpValues});
        }
        
    }

    
    return (
        <>
            <Header />
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Paper className={myProfileClasses.main}>
                            <Typography variant='h5' gutterBottom>My Profile</Typography>
                            <hr/>
                        </Paper>   
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={myProfileClasses.main}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' gutterBottom>Edit Profile</Typography>
                                </Grid>
                                <Grid item xs={12} >
                                    {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={() => handleCloseAlert('info')}>{alertBoxProps.message}</Alert>:""}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField {...userName} onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} />
                                    
                                </Grid>
                                <Grid item xs={12} className={classes.flex}>
                                    <div className={classes.grow}></div>
                                    <Button variant='contained' color='primary' onClick={() => updateUserInfo()}>Update</Button>
                                </Grid>
                                <Grid item xs={5}><hr/></Grid>
                                <Grid item xs={2} style={{textAlign:'center'}}><Typography variant='h6' gutterBottom>OR</Typography></Grid>
                                <Grid item xs={5}><hr/></Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h6' gutterBottom>Change Password</Typography>
                                </Grid>
                                <Grid item xs={12} >
                                    {passAlertBoxProps.isShow?<Alert severity={passAlertBoxProps.severity} onClose={() => handleCloseAlert('pass')}>{passAlertBoxProps.message}</Alert>:""}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField className={clsx(myProfileClasses.inputBox)} {...userPassword} onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} 
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
                                <Grid item xs={12} md={6}>
                                    <TextField className={clsx(myProfileClasses.inputBox)} {...userConfirmPassword} onChange={(e) => handleLoginDetails(e)} onBlur={(e) => handleLoginDetails(e)} 
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
                                <Grid item xs={12} className={classes.flex}>
                                    <div className={classes.grow}></div>
                                    <Button variant='contained' color='primary' onClick={() => updateUserPassword()}>Change</Button>
                                </Grid>
                                
                            </Grid>
                            
                        </Paper>   
                    </Grid>
                </Grid> 
            </Container>   
        </>
    );
}

