import React,{useState,useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {useClasses,useProductDetailsClasses} from '../style';
import {Paper,Grid, Typography,Toolbar,Container,Button} from '@material-ui/core';
import {Link,useParams} from 'react-router-dom';
import {API_URL,CURRENCY_SYMBOL} from '../../constant';
import Carousel from 'react-multi-carousel';
import {Header} from '../header'
import {Skeleton} from '@material-ui/lab';
import {
    ShoppingCartOutlined as AddToCartIcon,
    FlashOnOutlined as BuyNowIcon
} from '@material-ui/icons';
import {addToCart} from '../reducers';

export function ProductInfo(props){
    const classes = useClasses();
    const [isAutoPlay,setIsAutoPlay] = useState({autoPlay:false});

    const sliderResponsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 1
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };
    const handleAutoPlay = (e,status) => {
        setIsAutoPlay({autoPlay:status});
    }

    let finalPrize = props.productPrize;
    if (props.productDiscount>0){
        finalPrize = props.productPrize * (100-props.productDiscount)/100;
    }
    return(
        <Link className={classes.link} to={'/product-details/'+props.productID}>
            <Paper className={classes.productInfo} onMouseEnter={(e) => handleAutoPlay(e,true)} onMouseLeave={(e) => handleAutoPlay(e,false)}>
                <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.productImageBox}>
                        <Carousel responsive={sliderResponsive} arrows={false} {...isAutoPlay} infinite={true} draggable={false}>
                        {
                            props.productImage.map((imageInfo,index) =>(
                                <img key={index} className={classes.productInfoImage} src={API_URL+'image/'+imageInfo.imageName} alt={API_URL+'image/'+imageInfo.imageName}/>
                            ))
                        }
                        </Carousel>
                    </Grid>
                    <Grid item xs={12} className={classes.productNameBox} >
                        <Typography>{props.productName}</Typography>
                    </Grid>
                    {props.isPrizeBox&& 
                        <Grid item xs={12} className={classes.productPrizeBox} >
                            <span className={classes.productPrize}>{CURRENCY_SYMBOL}{parseFloat(finalPrize).toFixed(0)}</span>
                            {props.productDiscount>0 &&
                                <><span className={classes.productMRP}>{CURRENCY_SYMBOL}{props.productPrize}</span>
                                <span className={classes.productDiscount}>{props.productDiscount}% off</span></>
                            }
                        </Grid>
                    }
                </Grid>
            </Paper>
        </Link>
    );
}

export function ProductFullDetails(props){
    const classes = useClasses();
    const dispatch = useDispatch()
    const userCartInfo = useSelector((state) => state.GetUserCartInfo)
    const productDetailsClasses = useProductDetailsClasses();
    const {productID} = useParams();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productDetails,setProductDetails] = useState({});
    const [imageSrc, setImageSrc] = useState('');
    const [isAdded,setIsAdded] = useState(false);
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let apiUrl = API_URL+'product-detail/'+productID
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setProductDetails({...data.content});
                    setImageSrc(data.content.productImage[0].imageName)
                }else{
                    setProductDetails({});
                }
            });
        }
    })

    const sliderResponsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 4
        },
        miniDesktop: {
            breakpoint: { max: 1024, min: 600 },
            items: 3
        },
        tablet: {
          breakpoint: { max: 600, min: 464 },
          items: 4
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 3
        }
    };

    const handleFullImage = (fullImagePath) => {
        setImageSrc(fullImagePath);
    }

    let finalPrize = productDetails.productPrize;
    if (productDetails.productDiscount>0){
        finalPrize = productDetails.productPrize * (100-productDetails.productDiscount)/100;
    }
    
    useEffect(()=> {
        if( !isAdded && userCartInfo && userCartInfo.items){
            let productIndex = userCartInfo.items.findIndex(item => item.productID === productDetails.productID);
            if(productIndex >= 0){
                setIsAdded(true);
            }
        }
    },[isAdded,userCartInfo,productDetails.productID])

    const handleAddToCart = () => {
        dispatch(addToCart(productDetails));
        setIsAdded(true);
    }
    
    return(
        <>
        <Header />
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={5} md={5}>
                        <Paper className={productDetailsClasses.main}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} className={productDetailsClasses.fullImageBox}>
                                    {imageSrc?
                                    <img alt={API_URL+'image/'+imageSrc} src={API_URL+'image/'+imageSrc} className={productDetailsClasses.fullImage}/>
                                    :<Skeleton variant="rect" height={'50vh'} className={productDetailsClasses.fullImage} />}
                                    <hr/>
                                </Grid>
                                <Grid item xs={12} className={productDetailsClasses.imageSliderBox}>
                                    {productDetails.productImage ?
                                    <Carousel responsive={sliderResponsive}>
                                    {
                                        productDetails.productImage.map((imageInfo,index) =>(
                                            <div key={index} className={productDetailsClasses.smallImageBox} onMouseEnter={() => handleFullImage(imageInfo.imageName)} ><img  className={productDetailsClasses.smallImage} src={API_URL+'image/'+imageInfo.imageName} alt={API_URL+'image/'+imageInfo.imageName} /></div>
                                        ))
                                    }
                                    </Carousel>:
                                    <Skeleton variant="rect" height={'30vh'} width={'100%'} />
                                    }
                                    <hr/>
                                </Grid>
                                <Grid item xs={12} className={productDetailsClasses.buttonsBox}>
                                    <div className={productDetailsClasses.buyButtonsBox}>
                                        {isAdded ?
                                        <Button variant="contained" className={productDetailsClasses.addButtons} href="/my-cart"><AddToCartIcon/> Go to Cart</Button>:<Button variant="contained" className={productDetailsClasses.addButtons}onClick={() => handleAddToCart()}><AddToCartIcon/> Add to Cart</Button>}
                                    </div>
                                    <div className={productDetailsClasses.buyButtonsBox}>
                                        <Button variant="contained" className={productDetailsClasses.buyButtons}><BuyNowIcon/> Buy Now</Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={7} md={7}>
                        <Paper className={productDetailsClasses.main}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} className={classes.productNameBox} >
                                    <Typography variant='h5' gutterBottom>{productDetails.productName}</Typography>
                                </Grid>
                                <Grid item xs={12} className={productDetailsClasses.productPrizeBox} >
                                    <span className={productDetailsClasses.productPrize}>{CURRENCY_SYMBOL}{parseFloat(finalPrize).toFixed(0)}</span>
                                    {productDetails.productDiscount>0 &&
                                        <><span className={productDetailsClasses.productMRP}>{CURRENCY_SYMBOL}{productDetails.productPrize}</span>
                                        <span className={productDetailsClasses.productDiscount}>{productDetails.productDiscount}% off</span></>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <hr/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='h6' gutterBottom>Product Description</Typography>
                                    <Typography variant="body2" className={productDetailsClasses.productDescription} >{productDetails.productDescription}</Typography>
                                </Grid>
                            </Grid>
                            
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>                
    );
}

export default ProductInfo;