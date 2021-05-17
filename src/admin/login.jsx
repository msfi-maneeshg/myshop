import React,{useState} from 'react'
import clsx from 'clsx';
// import './style.css'
import {Grid,FormControl,InputAdornment,IconButton,InputLabel,makeStyles,OutlinedInput,Avatar,Typography,Button } from '@material-ui/core';
import {Visibility,VisibilityOff} from '@material-ui/icons';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {useFormValue} from './common'

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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                </Grid>
                <form className={classes.form} noValidate>
                    <Grid item xs={12} >
                        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                            <InputLabel htmlFor="input-email">Email</InputLabel>
                            <OutlinedInput
                                id="input-email"
                                {...userEmail}
                                labelWidth={40}
                            />
                            
                        </FormControl>
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