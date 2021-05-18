import React,{useEffect,useState} from 'react';
import {useStyles,useProductListStyle} from '../common'
import {Header} from '../header'
import {Sidebar} from '../sidebar'
import {CURRENCY_SYMBOL} from '../../constant'

import {Skeleton} from '@material-ui/lab'
import {
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
} from '@material-ui/core';

export function Products(){
    const classes = useStyles();
    const productListClasses = useProductListStyle();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productsList,setProductsList] = useState({products:[]}); 

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            fetch('http://localhost:8000/admin/product-list', requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setProductsList({products:data.content});
                }else{

                }
            });
        }
    })

    const loadingData = (
        <>
            <Paper className={classes.productBox}><ProductLoader/></Paper>
            <Paper className={classes.productBox}><ProductLoader/></Paper>
            <Paper className={classes.productBox}><ProductLoader/></Paper>
        </>
    );

    const productList = productsList.products.map(productDetail => (
        <Paper className={classes.productBox}><ProductInfo {...productDetail}/></Paper>
    ));

    return (
        <div className={classes.root}>
            <Header />
            <Sidebar isProduct={true} />
            <main className={classes.content}>
                <Toolbar />
                <Container maxWidth="lg">
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.innerHeader}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>All Product</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={productListClasses.paperBox}>
                                {productsList.products.length > 0?productList:loadingData}
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

function ProductInfo(props){
    const classes = useStyles();
    let finalPrize = (Number(props.productPrize)*(100-Number(props.productDiscount)))/100;
    return(
        <>
        <a href="/dummay-url" className={classes.productInfoBox}>
            <div className={classes.productInfoImgBox}>
                <img className={classes.productInfoImg} alt="Logo" src={"http://localhost:8000/image/"+props.productImage[0].imageName}/>
            </div>
            <div className={classes.productInfoContentBox}>
                
                <Typography variant="subtitle1">{props.productName}</Typography>
                <Typography display="block" gutterBottom variant="overline">
                    <span className={classes.productPrize}>{CURRENCY_SYMBOL}{finalPrize}</span>
                    <span className={classes.productMRP}>{CURRENCY_SYMBOL}{props.productPrize}</span>
                    <span className={classes.productDiscount}>{props.productDiscount}% off</span>
                </Typography>
               
            </div>
        </a>
        </>
    );
}