import React,{useEffect,useState} from 'react';
import {useStyles,useProductListStyle} from '../common'
import {Header} from '../header'
import {Sidebar} from '../sidebar'
import {CURRENCY_SYMBOL,API_URL} from '../../constant'
import Carousel from 'react-material-ui-carousel'
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
            fetch(API_URL+'admin/product-list', requestOptions)
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
            <Sidebar {...{menu:'product',subMenu:"product:list"}} />
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

export function ProductInfo(props){
    const [isAutoPlay,setIsAutoPlay] = useState(false)
    const classes = useStyles();
    let finalPrize = (Number(props.productPrize)*(100-Number(props.productDiscount)))/100;
   
    return(
        <>
        <a href={"/admin/product/edit/"+props.productID} className={classes.productInfoBox} onMouseEnter={() => setIsAutoPlay(true)} onMouseLeave={() => setIsAutoPlay(false)}>
            <div className={classes.productInfoImgBox}>
                <Carousel  interval={2000} indicators={false} navButtonsAlwaysInvisible={true} stopAutoPlayOnHover={false} autoPlay={isAutoPlay} animation="slide">
                {
                    props.productImage.map( (imageInfo, i) => <img key={i} className={classes.productInfoImg} alt="Logo" src={"http://localhost:8000/image/"+imageInfo.imageName}/> )
                }
                </Carousel>
            </div>
            <div className={classes.productInfoContentBox}>
                
                <Typography className={classes.productName} variant="subtitle1">{props.productName}</Typography>
                <Typography className={classes.productRate} display="block" gutterBottom variant="overline">
                    <span className={classes.productPrize}>{CURRENCY_SYMBOL}{finalPrize}</span>
                    {props.productDiscount > 0 &&
                    <><span className={classes.productMRP}>{CURRENCY_SYMBOL}{props.productPrize}</span>
                    <span className={classes.productDiscount}>{props.productDiscount}% off</span></>}
                </Typography>
               
            </div>
        </a>
        </>
    );
}