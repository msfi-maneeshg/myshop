import React,{useState,useEffect} from 'react';
import {Header} from '../header'
import {useClasses,useFilterSidebar,useProductList} from '../style'
import {Fade,Toolbar,Paper,Container,Grid, Typography,Slider,TextField } from '@material-ui/core';
import {Link} from 'react-router-dom'; 
import {API_URL} from '../../constant'
import {ProductInfo} from './product-info'
export function ProductList(){
    const classes = useClasses();
    const productListClasses = useProductList();
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productList,setProductList] = useState({products:[]});
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let apiUrl = API_URL+'admin/product-list?limit=10'
        
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
    return (
        <>
            <Header />
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Sidebar />
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={productListClasses.main}>
                            <Typography>Searched Products</Typography>
                            <hr/>
                            <Grid container>
                                {productList.products.map((productInfo,index) => (
                                    <Grid item  xs={12} sm={4} md={3} key={index}><ProductInfo  {...productInfo} isPrizeBox={true}/></Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}


function Sidebar(){
    const filterSidebarClasses = useFilterSidebar();
    const [value, setValue] = React.useState([1, 9999]);
    const [minPrizeRange,setMinPrizeRange] = useState({name:'minPrize',id:'minPrize',label:'Min',value:1,});
    const [maxPrizeRange,setMaxPrizeRange] = useState({name:'maxPrize',id:'maxPrize',label:'Max',value:9999,});

    const handleRangeChange = (event, newValue) => {
        let tempMin = minPrizeRange;
        let tempMax = maxPrizeRange;
        tempMin.value = newValue[0];
        tempMax.value = newValue[1];
        setMinPrizeRange({...tempMin});
        setMaxPrizeRange({...tempMax});
        setValue(newValue);
    };

    const handleInputRange = (e) =>{
        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        switch(fieldName){
            case 'minPrize':
                let tempMin = minPrizeRange;
                if (e.type === 'blur' ){
                    fieldValue = !fieldValue?1:Number(fieldValue);
                }
                tempMin.value = fieldValue;
                if(Number(fieldValue) < Number(maxPrizeRange.value) && !isNaN(Number(fieldValue))){
                    setMinPrizeRange({...tempMin});
                }
                break;
            case 'maxPrize':
                let tempMax = maxPrizeRange;
                if (e.type === 'blur'){
                    fieldValue = !fieldValue?9999:Number(fieldValue);
                }
                tempMax.value = fieldValue;
                if (fieldValue > minPrizeRange.value && !isNaN(Number(fieldValue))){
                    setMaxPrizeRange({...tempMax});
                }
                break;
            default:
        }

        setValue([Number(minPrizeRange.value),Number(maxPrizeRange.value)]);
    }

    return(
        <Paper className={filterSidebarClasses.main}>
            <Typography variant='h5' gutterBottom>Filters</Typography>
            <hr/>
            <div className={filterSidebarClasses.margin} >
                <Typography variant='h6' gutterBottom>Prize</Typography>
                <Slider
                    value={value}
                    onChange={handleRangeChange}
                    aria-labelledby="range-slider"
                    min={1}
                    max={99999}
                />
                <div className={filterSidebarClasses.prizeRangeInput}>
                    <TextField {...minPrizeRange} onBlur={(e) => handleInputRange(e)} onChange={(e) => handleInputRange(e)} variant="outlined" style={{marginRight:'4px'}} />
                    <TextField {...maxPrizeRange} onBlur={(e) => handleInputRange(e)} onChange={(e) => handleInputRange(e)} variant="outlined" style={{marginLeft:'4px'}} />
                </div>
                
            </div>
            <hr/>
        </Paper>
    )
}

