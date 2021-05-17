import React from 'react';
import {useStyles} from './common'
import {Header} from './header'
import {Sidebar} from './sidebar'
import {
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
} from '@material-ui/core';
import img1 from '../images/fs5659-fossil-original-imafhcafjbquntpj.jpeg'

import {Skeleton} from '@material-ui/lab'

export function Dashboard() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
        <Header />
        <Sidebar isDashboard={true} />
        <main className={classes.content}>
            <Toolbar />
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item xs={12}>
                        <Paper className={classes.innerHeader}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Dashboard</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperBox}>
                            <div className={classes.paperBoxHeading}>
                                <Typography component="h2" variant="h6" color="secondary" gutterBottom>Pending Orders</Typography>
                            </div>
                            <Paper className={classes.productBox}><ProductInfo/></Paper>
                            <Paper className={classes.productBox}><ProductLoader/></Paper>
                            <Paper className={classes.productBox}><ProductLoader/></Paper>
                            <Paper className={classes.productBox}><ProductLoader/></Paper>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperBox}>
                            <div className={classes.paperBoxHeading}>
                                <Typography component="h2" variant="h6" color="secondary" gutterBottom>Feature Products</Typography>
                            </div>
                            
                            <Paper className={classes.productBox}>
                                <ProductLoader/>
                            </Paper>
                            <Paper className={classes.productBox}><ProductLoader/></Paper>
                            <Paper className={classes.productBox}><ProductLoader/></Paper>
                            <Paper className={classes.productBox}><ProductLoader/></Paper>
                            
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </main>
    </div>
  );
}

function ProductLoader(){
    return (
        <>
            <Skeleton variant="rect" height={225} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />  
        </>
    );
}

function ProductInfo(){
    const classes = useStyles();
    return(
        <>
        <a href="/dummay-url" className={classes.productInfoBox}>
            <div className={classes.productInfoImgBox}>
                <img className={classes.productInfoImg} alt="Logo" src={img1}/>
            </div>
            <div className={classes.productInfoContentBox}>
                
                <Typography variant="subtitle1">Fossil Watch</Typography>
                <Typography display="block" gutterBottom variant="overline">
                    <span className={classes.productPrize}>₹1,500</span>
                    <span className={classes.productMRP}>₹3,000</span>
                    <span className={classes.productDiscount}>50% off</span>
                </Typography>
               
            </div>
        </a>
        </>
    );
}


export default Dashboard;