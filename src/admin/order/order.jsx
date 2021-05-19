import React ,{useState,useEffect}from 'react';
import {useStyles,useOrderListStyle} from '../common'
import {Header} from '../header'
import {Sidebar} from '../sidebar'
import clsx from 'clsx';
import {CURRENCY_SYMBOL} from '../../constant'
import {
    Container,
    Grid,
    Paper,
    Toolbar,
    Typography,
    TableContainer,Table,TableHead,TableRow,TableCell,TableSortLabel,TableBody,
    IconButton,InputBase,
    FormControl,NativeSelect
} from '@material-ui/core';
import {
    Search as SearchIcon,
    NavigateNextRounded as NextIcon,
    NavigateBeforeRounded as PreviousIcon,
} from '@material-ui/icons';
import img1 from '../../images/fs5659-fossil-original-imafhcafjbquntpj.jpeg'

import {Skeleton} from '@material-ui/lab'

export function AllOrders(props) {
    const paginationLimit = 10;
    const { order, orderBy } = props;
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [ordersList,setOrdersList] = useState([]); 
    const [orderType,setOrderType] = useState('all');
    const [isPrevious,setIsPrevious] = useState(false);
    const [isNext,setIsNext] = useState(false);
    const [totalRecords,setTotalRecords] = useState(0);
    const [paginationOffset,setPaginationOffset] = useState(0);
    const [searchValue,setSearchValue] = useState('');


    const classes = useStyles();
    const orderClasses = useOrderListStyle();
    const createSortHandler = (property) => (event) => {
        // onRequestSort(event, property);
    };
  const orderTableHead = [
    { id: 'orderID', numeric: false, label: 'ID' },
    { id: 'orderDate', numeric: false, label: 'Order Date' },
    { id: 'totalPayment', numeric: false, label: 'Total Payment' },
    { id: 'shippingAddress', numeric: false, label: 'Shipping Address' },
    { id: 'phone', numeric: false, label: 'Phone' },
    { id: 'orderStatus', numeric: false, label: 'Status' },
  ];

  

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            let apiUrl = 'http://localhost:8000/admin/order-list/'+paginationLimit+'/'+paginationOffset
            if (orderType){
                apiUrl = 'http://localhost:8000/admin/order-list/'+orderType+'/'+paginationLimit+'/'+paginationOffset
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
    setOrderType(e.target.value);
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
        <Sidebar {...{menu:'order',subMenu:"order:list"}} />
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
                                        value={orderType}
                                        onChange={(e) => changeOrderType(e)}
                                        name="Order Type"
                                        className={classes.selectEmpty}
                                        inputProps={{ 'aria-label': 'orderType' }}
                                        >
                                            <option value="all">All</option>
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="completed">Completed</option>
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
                                                    align={headCell.numeric ? 'right' : 'left'}
                                                    sortDirection={orderBy === headCell.id ? order : false}
                                                >
                                                    <TableSortLabel
                                                    active={orderBy === headCell.id}
                                                    direction={orderBy === headCell.id ? order : 'asc'}
                                                    onClick={createSortHandler(headCell.id)}
                                                    >
                                                    {headCell.label}
                                                    {orderBy === headCell.id ? (
                                                        <span className={classes.visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </span>
                                                    ) : null}
                                                    </TableSortLabel>
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
                                            </TableRow>
                                        ))
                                        :<TableRow>
                                            <TableCell colSpan={6} align="center">No {orderType !== "all" && orderType} order found!</TableCell>
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

export function CompletedOrders() {
    const classes = useStyles();
    return (
      <div className={classes.root}>
          <Header />
          <Sidebar {...{menu:'order',subMenu:"order:completed"}} />
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

export function PendingOrders() {
    const classes = useStyles();
    return (
      <div className={classes.root}>
          <Header />
          <Sidebar {...{menu:'order',subMenu:"order:pending"}} />
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