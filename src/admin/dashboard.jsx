import React,{useState,useEffect} from 'react';
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

import {Skeleton} from '@material-ui/lab'
import {API_URL} from '../constant'
import {ProductInfo} from './product/products'
export function Dashboard() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Header />
            <Sidebar {...{menu:'dashboard'}} />
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
                            <ProductList limit={5} listType="newStock" tabName="New Products"/>
                        </Grid>
                        <Grid item xs={12}>
                            <ProductList limit={5} listType="lowStock"  tabName="Low Stock Products"/>
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

function ProductList(props){
    const classes = useStyles();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productList,setProductList] = useState({products:[]}); 
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            let listType;
            if (props.listType === "lowStock"){
                listType = '&lowStock=ASC';
            }
            if (props.listType === "newStock"){
                listType = '&newStock=DESC';
            }
            let apiUrl = API_URL+'admin/product-list?limit='+props.limit+listType
        
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

    return (<>
        {productList && productList.products && <Paper className={classes.paperBox}>
            <div className={classes.paperBoxHeading}>
                <Typography component="h2" variant="h6" color="secondary" gutterBottom>{props.tabName}</Typography>
            </div>
            {productList && productList.products ?
            <>
            {productList.products.map((productInfo,index) => (
                <Paper key={index} className={classes.productBox}>
                    <ProductInfo {...productInfo}/>
                </Paper>
            ))}</>:
            <>
                <Paper className={classes.productBox}><ProductLoader/></Paper>
                <Paper className={classes.productBox}><ProductLoader/></Paper>
                <Paper className={classes.productBox}><ProductLoader/></Paper>
            </>
            }           
        </Paper>}
        </>         
    );
}

export default Dashboard;