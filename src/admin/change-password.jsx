import React,{useState} from 'react';
import {useStyles,useMyAccountStyle} from './common'
import {Header} from './header'
import {Sidebar} from './sidebar'
import {
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
    TextField,
    Button,
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {API_URL} from '../constant'
import {useSelector} from 'react-redux'

export function ChangePassword() {
    const loginUserInfo = useSelector((state) => state.checkLoginStatus);
    const classes = useStyles();
    const myAccountClasses = useMyAccountStyle();
    const [newPassword,setNewPassword] = useState({label:'New Password',name:'new-password',value:'',error:false});
    const [newConfirmPassword,setNewConfirmPassword] = useState({label:'Confirm Password',name:'confirm-password',value:'',error:false});
    const [alertBoxProps,setAlertBoxProps] = useState({isShow:false,severity:"info",message:""});

    const handleSetValues = (e) => {
        let tempValue;
        let isError = e.target.value?false:true;
        switch(e.target.name){
            case "new-password":
                tempValue = newPassword;
                tempValue.value = e.target.value;
                tempValue.error = isError;
                setNewPassword({...tempValue})
                break;
            case "confirm-password":
                tempValue = newConfirmPassword;
                tempValue.value = e.target.value;
                tempValue.error = isError;
                setNewConfirmPassword({...tempValue})
                break;
            default:
        }
    }

    const updatePassword = (e) => {
        let isValidate = true;
        if(newPassword.value === ""){
            let tempValue = newPassword;
            tempValue.error = true;
            setNewPassword({...tempValue});
            isValidate = false;
        }

        if(newConfirmPassword.value === ""){
            let tempValue = newConfirmPassword;
            tempValue.error = true;
            setNewConfirmPassword({...tempValue});
            isValidate = false;
        }

        if(newPassword.value !== newConfirmPassword.value){
            let tmpValues = alertBoxProps;
            tmpValues.isShow = true;
            tmpValues.message = "Password is not matching";
            tmpValues.severity = "error"
            setAlertBoxProps({...tmpValues});
            isValidate = false;
        }

        if(isValidate){
            let isStatusOK = false;
            let apiEndPoint = API_URL+'admin/change-password';
            let newFormData = new FormData();
            newFormData.append("password",newPassword.value)
            newFormData.append("userID",loginUserInfo.userID)

            const requestOptions = {
                method: 'UPDATE',
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
                    tmpValues.message = data.content;                
                    tmpValues.severity =  isStatusOK?"success":"error";
                    setAlertBoxProps({...tmpValues});
                    if(isStatusOK){
                        let tempValue = newPassword;
                        tempValue.value = '';
                        setNewPassword({...tempValue});

                        tempValue = newConfirmPassword;
                        tempValue.value = '';
                        setNewConfirmPassword({...tempValue});
                        isValidate = false;
                    }
                });
        }
    }

    const handleCloseAlert = (e) => {
        let tmpValues = alertBoxProps;
        tmpValues.isShow = false;
        setAlertBoxProps({...tmpValues});
    }
    return (
        <div className={classes.root}>
            <Header />
            <Sidebar {...{menu:'my-account'}} />
            <main className={classes.content}>
                <Toolbar />
                <Container maxWidth="lg">
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.innerHeader}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>Change Password</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={myAccountClasses.paperBox}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        {alertBoxProps.isShow?<Alert severity={alertBoxProps.severity} onClose={(e) => handleCloseAlert(e)}>{alertBoxProps.message}</Alert>:""}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField type="password" id="outlined-basic" variant="outlined"  {...newPassword} onChange={(e) => handleSetValues(e)} onBlur={(e) => handleSetValues(e)} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField type="password" id="outlined-basic" variant="outlined"  {...newConfirmPassword} onChange={(e) => handleSetValues(e)} onBlur={(e) => handleSetValues(e)} />
                                    </Grid>
                                    <Grid item xs={12}>
                                    <Button variant="outlined" color="primary" onClick={(e) => updatePassword(e)}>
                                        Update
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        
                    </Grid>
                </Container>
            </main>
        </div>
    );
}

