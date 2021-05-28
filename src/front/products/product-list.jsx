import React,{useState,useEffect,Suspense, lazy} from 'react';
import {Header} from '../header'
import {useClasses,useFilterSidebar,useProductList} from '../style'
import {
    FormControlLabel,Radio ,Toolbar,Paper,Container,
    Grid, Typography,Slider,TextField ,RadioGroup,
    CircularProgress
} from '@material-ui/core';
import {API_URL} from '../../constant'

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import {ProductInfo} from './product-info'

const ProductInfo = lazy(() => import('./product-info'));

export function ProductList(){
    const classes = useClasses();
    const productListClasses = useProductList();
    const [rangeValue, setRangeValue] = useState([1, 9999]);
    const [minPrizeRange,setMinPrizeRange] = useState({name:'minPrize',id:'minPrize',label:'Min',value:1,});
    const [maxPrizeRange,setMaxPrizeRange] = useState({name:'maxPrize',id:'maxPrize',label:'Max',value:9999,});
    const [discountValue,setDiscountValue] = useState('discount:all')
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [productList,setProductList] = useState({products:[]});
    
    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            
            let apiUrl = API_URL+'product-list?limit=10&minPrize='+rangeValue[0]+'&maxPrize='+rangeValue[1]+'&discount='+discountValue
        
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
    return (
        <>
            <Header />
            <Toolbar />
            <Container maxWidth="lg" className={classes.mainContainer}>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Sidebar rangeValue={rangeValue} setRangeValue={setRangeValue} minPrizeRange={minPrizeRange} maxPrizeRange={maxPrizeRange} setMaxPrizeRange={setMaxPrizeRange} setMinPrizeRange={setMinPrizeRange} setIsDataLoaded={setIsDataLoaded} discountValue={discountValue} setDiscountValue={setDiscountValue}/>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={productListClasses.main}>
                            <Typography variant='h5' gutterBottom>Searched Products</Typography>
                            <hr/>
                            <Grid container>
                            {isDataLoaded?    
                                <>{productList.products && productList.products.length > 0 && isDataLoaded? productList.products.map((productInfo,index) => (
                                    <Grid item  xs={12} sm={4} md={3} key={index}>
                                        <Suspense fallback={<CircularProgress />}>
                                            <ProductInfo  {...productInfo} isPrizeBox={true}/>
                                        </Suspense>
                                        
                                    </Grid>
                                )):<div className={classes.noResultFound}><Typography variant='h5' gutterBottom>Sorry, no results found!</Typography></div>}
                                </>
                                :
                                <div className={classes.ProductListLoading}><CircularProgress /></div>
                            }
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}


function Sidebar(props){
    const classes = useClasses();
    const filterSidebarClasses = useFilterSidebar();
    

    const handleRangeChange = (event, newValue) => {
        let tempMin = props.minPrizeRange;
        let tempMax = props.maxPrizeRange;
        tempMin.value = newValue[0];
        tempMax.value = newValue[1];
        props.setMinPrizeRange({...tempMin});
        props.setMaxPrizeRange({...tempMax});
        props.setRangeValue(newValue);
        props.setIsDataLoaded(false)
    };

    const handleInputRange = (e) =>{
        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        switch(fieldName){
            case 'minPrize':
                let tempMin = props.minPrizeRange;
                if (e.type === 'blur' ){
                    fieldValue = !fieldValue?1:Number(fieldValue);
                }
                tempMin.value = fieldValue;
                if(Number(fieldValue) > 0 && Number(fieldValue) < Number(props.maxPrizeRange.value) && !isNaN(Number(fieldValue))){
                    props.setMinPrizeRange({...tempMin});
                    props.setRangeValue([Number(props.minPrizeRange.value),Number(props.maxPrizeRange.value)]);
                }
                break;
            case 'maxPrize':
                let tempMax = props.maxPrizeRange;
                if (e.type === 'blur'){
                    fieldValue = !fieldValue?9999:Number(fieldValue);
                }
                tempMax.value = fieldValue;
                if (Number(fieldValue) <= 99999 && fieldValue > props.minPrizeRange.value && !isNaN(Number(fieldValue))){
                    props.setMaxPrizeRange({...tempMax});
                    props.setRangeValue([Number(props.minPrizeRange.value),Number(props.maxPrizeRange.value)]);
                }
                break;
            default:
        }
        if(e.type === 'blur'){
            props.setIsDataLoaded(false)
        }
        
    }

    const handleDiscountValue = (e) => {
        props.setDiscountValue(e.target.value)
        props.setIsDataLoaded(false)
    }

    return(
        <Paper className={filterSidebarClasses.main}>
            <Typography variant='h5' gutterBottom>Filters</Typography>
            <hr/>
            <div className={filterSidebarClasses.margin} >
                <Typography variant='h6' gutterBottom>Prize</Typography>
                <Slider
                    value={props.rangeValue}
                    onChange={handleRangeChange}
                    aria-labelledby="range-slider"
                    min={1}
                    max={99999}
                />
                <div className={filterSidebarClasses.prizeRangeInput}>
                    <TextField type='number' {...props.minPrizeRange} onBlur={(e) => handleInputRange(e)} onChange={(e) => handleInputRange(e)} variant="outlined" style={{marginRight:'4px'}} className={filterSidebarClasses.prizeRangeInput} />
                    <TextField type='number' {...props.maxPrizeRange} onBlur={(e) => handleInputRange(e)} onChange={(e) => handleInputRange(e)} variant="outlined" style={{marginLeft:'4px'}} />
                </div>
                
            </div>
            <hr/>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                    <Typography className={classes.heading}>Discount</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RadioGroup aria-label="discount" name="discount" value={props.discountValue} onChange={(e) => handleDiscountValue(e)}>
                        <FormControlLabel value="discount:all" control={<Radio   color="primary"/>} label="All" />
                        <FormControlLabel value="discount:10:more" control={<Radio  color="primary"/>} label="10% or more" />
                        <FormControlLabel value="discount:20:more" control={<Radio  color="primary"/>} label="20% or more" />
                        <FormControlLabel value="discount:30:more" control={<Radio  color="primary"/>} label="30% or more" />
                        <FormControlLabel value="discount:40:more" control={<Radio  color="primary"/>} label="40% or more" />
                        <FormControlLabel value="discount:50:more" control={<Radio  color="primary"/>} label="50% or more" />
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>
        </Paper>
    )
}

