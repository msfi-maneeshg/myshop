import React from 'react';
import {useClasses} from '../style'
import {Paper,Grid, Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {API_URL} from '../../constant'

export function ProductInfo(props){
    const classes = useClasses();
    return(
        <Link>
            <Paper className={classes.productInfo}>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.productImageBox}>
                        <img className={classes.productInfoImage} src={API_URL+'image/'+props.productImage[0].imageName}/>
                    </Grid>
                    <Grid item xs={12} className={classes.productNameBox} >
                        <Typography>{props.productName}</Typography>
                    </Grid>
                    {props.isPrizeBox&& 
                    <Grid item xs={12} className={classes.productPrizeBox} >
                        <Typography>{props.productName}</Typography>
                    </Grid>}
                </Grid>
            </Paper>
        </Link>
    );
}