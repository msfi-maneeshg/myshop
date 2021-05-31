
import React ,{useState,useEffect}from 'react';
import {useStyles,useCategoryStyle} from './common'
import {Header} from './header'
import {Sidebar} from './sidebar'
import clsx from 'clsx';
import {CURRENCY_SYMBOL,ORDER_PAGINATION_LIMIT} from '../constant'
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
import {useParams} from 'react-router-dom';


export function Category() {
    const {type}  = useParams();
    const paginationLimit = ORDER_PAGINATION_LIMIT;
    const [isDataLoaded,setIsDataLoaded] = useState(false); 
    const [categoryList,setCategoryList] = useState([]); 
    
    const [isPrevious,setIsPrevious] = useState(false);
    const [isNext,setIsNext] = useState(false);
    const [totalRecords,setTotalRecords] = useState(0);
    const [paginationOffset,setPaginationOffset] = useState(0);
    const [searchValue,setSearchValue] = useState('');


    const classes = useStyles();
    const categoryClasses = useCategoryStyle();
  
    const categoryTableHead = [
        { id: 'categoryID', label: 'Category ID' },
        { id: 'categoryName', label: 'Category Name' },
        { id: 'categotyURL', label: 'Category URL' },
    ];

  

    useEffect(() => {
        if(!isDataLoaded){
            let isStatusOK = false;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' },
            };
            let apiUrl = 'http://localhost:8000/admin/category-list/'+paginationLimit+'/'+paginationOffset

            fetch(apiUrl+"?search="+searchValue, requestOptions)
            .then((response) => {
                const data = response.json()
                isStatusOK = response.status;
                return data   
            })
            .then((data) => {
                setIsDataLoaded(true)
                if(isStatusOK){
                    setTotalRecords(data.content.totalCategory);
                    if(data.content.totalCategory > 0){
                        setCategoryList(data.content);
                        if(paginationOffset < paginationLimit){
                            setIsPrevious(false);
                        }else{
                            setIsPrevious(true);
                        }

                        if(Number(paginationOffset)+Number(paginationLimit) >= Number(data.content.totalCategory)){
                            setIsNext(false);
                        }else{
                            setIsNext(true);
                        }
                    }else{
                        setCategoryList({category:[]});
                        setIsPrevious(false);
                        setIsNext(false);
                    }
                }else{

                }
            });
        }
    })

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
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Category List</Typography>
                            <div className={classes.grow} ></div>
                            <Button variant='contained' color='primary'>Add New</Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        
                        <Paper className={categoryClasses.paperBox}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Paper className={clsx(categoryClasses.searchBoxForm)}>
                                    <InputBase
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className={categoryClasses.inputSearchBox}
                                        placeholder="Search Category..."
                                        inputProps={{ 'aria-label': 'search category' }}
                                    />
                                    <IconButton onClick={() => setIsDataLoaded(false)} className={categoryClasses.searchIconButton} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                    
                                    </Paper>
                                </Grid>
                                
                            </Grid>
                            <Paper style={{width: '100%' }}>
                                <TableContainer style={{height: '70vh' }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                {categoryTableHead.map((headCell) => (
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
                                        {categoryList.category && categoryList.category.length >  0 ?           
                                        categoryList.category.map((categoryInfo,index)=>(
                                            <TableRow hover key={index}>
                                                <TableCell align="left">{categoryInfo.orderID}</TableCell>
                                                <TableCell align="left">{categoryInfo.orderDate}</TableCell>
                                                <TableCell align="left">{categoryInfo.totalPayment}</TableCell>
                                            </TableRow>
                                        ))
                                        :<TableRow>
                                            <TableCell colSpan={3} align="center">No Category found!</TableCell>
                                        </TableRow>}
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                                <hr/>
                                <TableContainer style={{height: '10vh' }}>
                                    <Paper className={clsx(categoryClasses.paginationButtons,{[categoryClasses.activePaginationButtons]: isNext})} onClick={() => getNextRecords()}><NextIcon/></Paper>
                                    <Paper className={clsx(categoryClasses.paginationButtons,{[categoryClasses.activePaginationButtons]: isPrevious})} onClick={() => getPreviousRecords()}><PreviousIcon/></Paper>
                                    <div className={categoryClasses.paginationRecoedInfo}>{totalRecords > 0 && recordsFrom+"-"+recordsTo+" of " + totalRecords}</div>
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
