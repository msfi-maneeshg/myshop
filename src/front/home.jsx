import React,{useState,useEffect} from 'react';
import {Header} from './header'
import {useClasses,useLoginModalStyles,useDealOfTheDay,useEssentialsDeals,useCategoryProducts} from './style'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import {Fade,Toolbar,Paper,Container,Grid, Typography,Button} from '@material-ui/core';
import {Login} from './login';
import {useSelector} from 'react-redux'
import Carousel from 'react-multi-carousel'
import {API_URL} from '../constant'
import {Link} from 'react-router-dom'
import {ProductInfo} from './products/product-info'
import "react-multi-carousel/lib/styles.css";

export function Home(){
    const classes = useClasses();
   

    
    return (
        <>
        <Header />
        <Toolbar />
        <Container maxWidth="lg" className={classes.mainContainer}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={12} >
                    <BannerProducts />
                </Grid>
                <Grid item xs={12} md={9}>
                    <DealOfTheDay showProducts={4} isViewAll={true}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <EssentialsForYou/>
                </Grid>
                <Grid item xs={12} md={12}>
                    <CategoryProducts cateName={"Covid Care Must-haves"}/>
                </Grid>
                <Grid item xs={12} md={12}>
                    <CategoryProducts cateName={"Best of Electronics"}/>
                </Grid>
                <Grid item xs={12} md={12}>
                    <CategoryProducts cateName={"Furniture Bestsellers"}/>
                </Grid>
                <Grid item xs={12} md={12}>
                    <CategoryProducts cateName={"Home Makeover"}/>
                </Grid>
            </Grid>
        </Container>



        
        <TransitionsModal />
        </>
    );
}

export default function TransitionsModal() {
  const loginModalClasses = useLoginModalStyles();
  const [open, setOpen] = React.useState(true);
  const userLoginDetails = useSelector((state) => state.checkLoginStatus)  
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        className={loginModalClasses.modal}
        open={open && !userLoginDetails.isLoggedin}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open && !userLoginDetails.isLoggedin}>
          <Paper className={loginModalClasses.paper}>
            <Login />
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}

function BannerProducts(props){
    const classes = useClasses();
    const dealOfTheDayClasses = useDealOfTheDay(); 

    const dealOfTheDay = {
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
    const imagePath = "assets/images/banner/";
    const bannerProducts = [imagePath+'banner1.jpg',imagePath+'banner2.jpg',imagePath+'banner3.jpg',imagePath+'banner4.jpg',imagePath+'banner5.jpg'];
    return(<>
        {bannerProducts &&
        
            <Paper className={dealOfTheDayClasses.dealOfTheDayMain}>
                <Carousel autoPlay={true} infinite={true}  responsive={dealOfTheDay}>
                {
                    bannerProducts.map((bannerInfo,index) =>(
                    <img alt={API_URL+ 'image/'+bannerInfo} className={classes.bannerImage} key={index} src={API_URL+ 'image/'+bannerInfo} /> 
                    ))
                }
                </Carousel>
            </Paper>
        }
    </>);
}

function DealOfTheDay(props){
    const classes = useClasses();
    const dealOfTheDayClasses = useDealOfTheDay();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productList,setProductList] = useState({products:[]});

    const tabletItem = props.showProducts>1?Number(parseFloat((props.showProducts+1)*2/3).toFixed(0)):1;
    const dealOfTheDay = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: props.showProducts
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: tabletItem
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };
    
     
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
           
            let apiUrl = API_URL+'product-list?limit=10'
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setProductList({products:data.content});
                }else{
                    setProductList({products:[]});
                }
            });
        }
    },[isDataLoaded])
    return(<>
        {isDataLoaded &&
        
            <Paper className={dealOfTheDayClasses.dealOfTheDayMain}>
                <div className={dealOfTheDayClasses.headingBox}>
                    <Typography component="h1" variant="h5">Deals of the Day</Typography>
                    <div className={classes.grow} />
                    {props.isViewAll&&<Link to="/product-list" className={classes.link}><Button variant="contained" color="primary">View All</Button></Link>}
                </div>
                <hr/>
                <div className={classes.productInfoImgBox}>
                    <Carousel  responsive={dealOfTheDay}>
                    {
                        productList.products.map((productInfo,index) =>(
                        <ProductInfo key={index} {...productInfo}/> 
                        ))
                    }
                    </Carousel>
                </div>
            </Paper>
        }
    </>);
}


function EssentialsForYou(props){
    const classes = useClasses();
    const essentialsDealsClasses = useEssentialsDeals();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productList,setProductList] = useState({products:[]});

    const dealOfTheDay = {
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
    
     
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            let apiUrl = API_URL+'product-list?limit=10'
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setProductList({products:data.content});
                }else{
                    setProductList({products:[]});
                }
            });
        }
    })
    return(<>
        {isDataLoaded &&
            <Paper className={essentialsDealsClasses.main}>
                <div className={essentialsDealsClasses.headingBox}>
                    <Typography component="h1" variant="h5">Essentials For You!</Typography>
                </div>
                <hr/>
                <div className={classes.productInfoImgBox}>
                    <Carousel  responsive={dealOfTheDay}>
                    {
                        productList.products.map((productInfo,index) =>(
                        <ProductInfo key={index} {...productInfo}/> 
                        ))
                    }
                    </Carousel>
                </div>
            </Paper>
        }
    </>);
}

function CategoryProducts(props){
    const classes = useClasses();
    const categoryProductsClasses = useCategoryProducts();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productList,setProductList] = useState({products:[]});

    const dealOfTheDay = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 6
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
    };
    
     
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let apiUrl = API_URL+'product-list?limit=10'
        
            fetch(apiUrl, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setProductList({products:data.content});
                }else{
                    setProductList({products:[]});
                }
            });
        }
    })
    return(<>
        {isDataLoaded &&
        
            <Paper className={categoryProductsClasses.main}>
                <div className={categoryProductsClasses.headingBox}>
                    <Typography component="h1" variant="h5">{props.cateName}</Typography>
                    <div className={classes.grow} />
                    <Link to="/product-list" className={classes.link}><Button variant="contained" color="primary">View All</Button></Link>
                </div>
                <hr/>
                <div className={classes.productInfoImgBox}>
                    <Carousel  responsive={dealOfTheDay}>
                    {
                        productList.products.map((productInfo,index) =>(
                        <ProductInfo key={index} {...productInfo}/> 
                        ))
                    }
                    </Carousel>
                </div>
            </Paper>
        }
    </>);
}