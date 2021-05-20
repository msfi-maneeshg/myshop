import React ,{useState,useEffect}from 'react';
import {useStyles,useOrderListStyle} from '../common'
import {Header} from '../header'
import {Sidebar} from '../sidebar'
import clsx from 'clsx';
import {CURRENCY_SYMBOL,ORDER_PAGINATION_LIMIT} from '../../constant'
import {Link} from 'react-router-dom'
import {
    Button,
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
    TableContainer,Table,TableHead,TableRow,TableCell,TableBody,
    IconButton,InputBase,
    FormControl,NativeSelect
} from '@material-ui/core';
import {
    Search as SearchIcon,
    NavigateNextRounded as NextIcon,
    NavigateBeforeRounded as PreviousIcon,
} from '@material-ui/icons';

export function AllOrders() {
    const paginationLimit = ORDER_PAGINATION_LIMIT;
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [ordersList,setOrdersList] = useState([]); 
    const [orderType,setOrderType] = useState({value:'all'});
    
    const [isPrevious,setIsPrevious] = useState(false);
    const [isNext,setIsNext] = useState(false);
    const [totalRecords,setTotalRecords] = useState(0);
    const [paginationOffset,setPaginationOffset] = useState(0);
    const [searchValue,setSearchValue] = useState('');


    const classes = useStyles();
    const orderClasses = useOrderListStyle();
  
    const orderTableHead = [
        { id: 'orderID', label: 'ID' },
        { id: 'orderDate', label: 'Order Date' },
        { id: 'totalPayment', label: 'Total Payment' },
        { id: 'shippingAddress', label: 'Shipping Address' },
        { id: 'phone', label: 'Phone' },
        { id: 'orderStatus', label: 'Status' },
        { id: 'action', label: 'Action' },
    ];

  

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            let apiUrl = 'http://localhost:8000/admin/order-list/'+paginationLimit+'/'+paginationOffset
            if (orderType.value){
                apiUrl = 'http://localhost:8000/admin/order-list/'+orderType.value+'/'+paginationLimit+'/'+paginationOffset
            }

            fetch(apiUrl+"?search="+searchValue, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setTotalRecords(data.content.totalOrders);
                    if(data.content.totalOrders > 0){
                        setOrdersList(data.content);
                        if(paginationOffset < paginationLimit){
                            setIsPrevious(false);
                        }else{
                            setIsPrevious(true);
                        }

                        if(Number(paginationOffset)+Number(paginationLimit) >= Number(data.content.totalOrders)){
                            setIsNext(false);
                        }else{
                            setIsNext(true);
                        }
                    }else{
                        setOrdersList({orders:[]});
                        setIsPrevious(false);
                        setIsNext(false);
                    }
                }else{

                }
            });
        }
    })
  
  const changeOrderType = (e) => {
    setPaginationOffset(0);
    setOrderType({value:e.target.value});
    setIsDataLoaded(false);
  }

  const getNextRecords = () => {
    if (isNext)  {
        setPaginationOffset(paginationOffset+paginationLimit);
        setIsDataLoaded(false);
    }
  }

  const getPreviousRecords = () => {
    if (isPrevious)  {
        let newOffset = paginationOffset-paginationLimit;
        if  (newOffset < 0){
            newOffset = 0;
        }
        setPaginationOffset(newOffset);
        setIsDataLoaded(false);
    }
  }


  let recordsFrom = paginationOffset+1;
  let recordsTo = paginationOffset+paginationLimit;
  if (recordsTo > totalRecords){
    recordsTo = totalRecords;
  }
    
  return (
    <div className={classes.root}>
        <Header />
        <Sidebar {...{menu:'order'}} />
        <main className={classes.content}>
            <Toolbar />
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item xs={12}>
                        <Paper className={classes.innerHeader}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Orders List</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        
                        <Paper className={orderClasses.paperBox}>
                            <Grid container>
                                <Grid item xs={7}>
                                    <Paper className={clsx(orderClasses.searchBoxForm)}>
                                    <InputBase
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className={orderClasses.inputSearchBox}
                                        placeholder="Search Order ID"
                                        inputProps={{ 'aria-label': 'search order id' }}
                                    />
                                    <IconButton onClick={() => setIsDataLoaded(false)} className={orderClasses.searchIconButton} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                    
                                </Paper>
                                </Grid>
                                <Grid item xs={5}>
                                    <Paper className={clsx(orderClasses.filterBoxForm)}>
                                    <FormControl className={orderClasses.selectSearchBox}>
                                        <NativeSelect
                                        value={orderType.value}
                                        onChange={(e) => changeOrderType(e)}
                                        name="Order Type"
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'orderType' }}
                                        >
                                            <option value="all">All</option>
                                            <option value="1">Pending</option>
                                            <option value="2">Approved</option>
                                            <option value="3">Shipped</option>
                                            <option value="4">Completed</option>
                                            <option value="5">Rejected</option>
                                            <option value="6">Calcelled</option>
                                        </NativeSelect>
                                    </FormControl>
                                </Paper>
                                </Grid>
                            </Grid>
                            <Paper style={{width: '100%' }}>
                                <TableContainer style={{height: '70vh' }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                {orderTableHead.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    align="left"
                                                >
                                                    {headCell.label}
                                                </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {ordersList.orders && ordersList.orders.length >  0 ?           
                                        ordersList.orders.map((orderInfo,index)=>(
                                            <TableRow hover key={index}>
                                                <TableCell align="left">{orderInfo.orderID}</TableCell>
                                                <TableCell align="left">{orderInfo.orderDate}</TableCell>
                                                <TableCell align="left">{CURRENCY_SYMBOL}{orderInfo.totalPayment}</TableCell>
                                                <TableCell align="left">{orderInfo.shippingAddress}</TableCell>
                                                <TableCell align="left">{orderInfo.phone}</TableCell>
                                                <TableCell align="left">{orderInfo.orderStatus}</TableCell>
                                                <TableCell align="left">
                                                    <Link className={classes.link} to={"/admin/order-details/"+orderInfo.orderID}><Button variant="outlined" color="primary">View</Button></Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                        :<TableRow>
                                            <TableCell colSpan={6} align="center">No {orderType.value !== "all" && orderType.value} order found!</TableCell>
                                        </TableRow>}
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                                <hr/>
                                <TableContainer style={{height: '10vh' }}>
                                    <Paper className={clsx(orderClasses.paginationButtons,{[orderClasses.activePaginationButtons]: isNext})} onClick={() => getNextRecords()}><NextIcon/></Paper>
                                    <Paper className={clsx(orderClasses.paginationButtons,{[orderClasses.activePaginationButtons]: isPrevious})} onClick={() => getPreviousRecords()}><PreviousIcon/></Paper>
                                    <div className={orderClasses.paginationRecoedInfo}>{totalRecords > 0 && recordsFrom+"-"+recordsTo+" of " + totalRecords}</div>
                                </TableContainer>
                            </Paper>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </main>
    </div>
  );
} 
