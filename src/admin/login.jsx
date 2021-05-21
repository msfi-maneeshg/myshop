import React,{useState} from 'react'
import clsx from 'clsx';
import {Alert} from '@material-ui/lab';
import {Grid,FormControl,InputAdornment,IconButton,InputLabel,makeStyles,OutlinedInput,Avatar,Typography,Button,TextField } from '@material-ui/core';
import {Visibility,VisibilityOff} from '@material-ui/icons';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {useFormValue} from './common'
import {useDispatch } from 'react-redux'
import {changeLoginStatus} from './reducers'
import {API_URL} from '../constant'
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '35ch',
    },
    paper: {
        marginTop: theme.spacing(10),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    }
}));

export function Login(){
    const classes = useStyles();
    const userEmail = useFormValue('');
    const userPassword = useFormValue('');
    const [showPassword, setShowPassword] = useState(false);
    const [alertBoxProps,setAlertBoxProps] = useState({isShow:false,severity:"info",message:""});
    const dispatch = useDispatch();
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const checkLogin = (e) => {
        let isValidate = true;
        if (userEmail.value === "") {
            isValidate = false;
        }

        if (userPassword.value === "") {
            isValidate = false;
        }

        if(isValidate){
            let isStatusOK = false;
            let apiEndPoint = API_URL+'admin/check-login';
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

    const loginInterface = (
        <Grid
            container
            direction="row"
            justify="center"
        >
            <div className={classes.paper}>
                <Grid item xs={12}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        MyShop
                    </Typography>
                </Grid>
                <form className={classes.form} noValidate onSubmit={(e) => checkLogin(e)}>
                    <Grid item xs={12} >
                    {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                    </Grid>
                    <Grid item xs={12} >
                        <TextField type="email" id="input-email" className={clsx(classes.margin, classes.textField)} {...userEmail} label="Email" variant="outlined"/>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                            <InputLabel htmlFor="input-password">Password</InputLabel>
                            <OutlinedInput
                                id="input-password"
                                type={showPassword ? 'text' : 'password'}
                                {...userPassword}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                labelWidth={70}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                    </Grid>
                </form>                
            </div>            
        </Grid> 
    )

    return loginInterface;
}





export default Login;