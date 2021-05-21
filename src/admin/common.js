import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

export function useFormValue(initialValue){
    const [value , setValue] = useState(initialValue); 

    function handleValues(e){
        setValue(e.target.value);
    }

    return {
        value:value,
        onChange:handleValues
    };
}

const drawerWidth = 240;
export const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      flexWrap: 'wrap',
    },
    paperBox: {
        margin: theme.spacing(1,1,1,1),
        height: '65vh',
        background: '#7ba3fb66',
        padding: theme.spacing(1,1,1,1),
        display: 'flex',
        flexWrap: 'wrap',
        overflowX:'auto',
    },
    innerHeader:{
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(2,1,1,1),
        height: '5vh',
        background: '#7ba3fb66',
        padding: theme.spacing(1,1,1,2),
    },
    productBox: {
        margin: theme.spacing(1,1,1,1),
        height: '50vh',
        width:'30vh',
        padding: theme.spacing(1,1,1,1)
    },
    paperBoxHeading:{
        width:'100%',
        paddingLeft: theme.spacing(1),
    },
    paperBoxProducts:{
        overflowX:'auto',
    },
    productInfoBox:{
        textDecoration: 'none',
    },
    productInfoImgBox:{
        height: '35vh',
        textAlign: 'center',
    },
    productInfoImg:{
        maxWidth:'100%',
        maxHeight: '35vh',
    },
    productInfoContentBox:{
        textAlign: 'center',
        marginTop:'5px',
    },
    productPrize:{
        margin: '5px',
        fontSize: 'large',
    },
    productMRP:{
        margin: '2px',
        fontSize: 'x-small',
        textDecoration: 'line-through',
    },
    productDiscount:{
        margin: '2px',
        fontWeight:'800',
        color: 'darkred',
    },
    subMenu: {
      paddingLeft: theme.spacing(4),
    },
    link:{
      textDecoration: 'none',
      color: '#757575',
    },
    productName:{
      marginTop:theme.spacing(1),
      maxHeight:"45px",
      lineHeight:"1",
      overflow:"hidden",
    },
    productRate:{
      marginTop:theme.spacing(1),
      maxHeight:"30px",
      lineHeight:"1",
      overflow:"hidden",
    },
}));


export const useAddProductStyle = makeStyles((theme) => ({
    paperBoxAddProduct:{
      margin: theme.spacing(1,1,1,1),
      padding: theme.spacing(1,1,1,1),
    },
    fullWidth:{
      width:'100%',
    },
    fullWidthGrid:{
      padding:theme.spacing(2,1,1,1),
    },
    productImagesBox:{
      display:'flex',
      flexWrap: 'wrap',
    },
    addProductImageIcon:{
      fontSize: '50px',
    },
    addProductImgBox:{
      height: '35vh',
      textAlign: 'center',
      width:'30vh',
      cursor:'pointer',
    },
    productInfoImg:{
      maxWidth: '30vh',
      maxHeight: '34vh',
    },
    productImageBox:{
      display: 'flex',
      flexWrap: 'wrap',
    },
    productInfoImgBox:{
      margin: theme.spacing(1,1,1,1),
      height: '35vh',
      width:'30vh',
      padding: theme.spacing(1,1,1,1),
      textAlign:'center',
    }
}));

export const useProductListStyle = makeStyles((theme) => ({
  paperBox: {
    margin: theme.spacing(1,1,1,),
    height: 'auto',
    background: '#7ba3fb66',
    padding: theme.spacing(1,1,1,1),
    display: 'flex',
    flexWrap: 'wrap',
    overflowX:'auto',
  },
}));


export const useOrderListStyle = makeStyles((theme) => ({
  paperBox: {
    margin: theme.spacing(1,1,1,1),
    height: '92vh',
    background: '#7ba3fb66',
    padding: theme.spacing(1,1,1,1),
    display: 'flex',
    flexWrap: 'wrap',
    overflowX:'auto',
  },  
  searchBoxForm:{
    display: 'flex',
    flexWrap: 'wrap',
    marginRight:theme.spacing(1),
  },
  filterBoxForm:{
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft:theme.spacing(1),
  },
  searchIconButton:{
    width:'10%',
  },
  inputSearchBox:{
    width:'90%',
    paddingLeft:theme.spacing(1),
  },
  selectSearchBox:{
    width:'100%',
    padding: theme.spacing(1,1,1,1),
  },
  paginationButtons:{
    display:'flex',
    flexWrap: 'wrap',
    float:'right',
    padding: theme.spacing(1,1,1,1),
    margin: theme.spacing(1,1,1,1),
    background:'#cadafd00',
    '&:hover':{
      cursor:'no-drop',
    }
  },
  activePaginationButtons:{
    background:'#cadafd59',
    '&:hover':{
      background:'#cadafd',
      cursor:'pointer',
    }
  },
  paginationRecoedInfo:{
    display:'flex',
    flexWrap: 'wrap',
    float:'right',
    padding: theme.spacing(1,1,1,1),
    margin: theme.spacing(1,1,1,1),
  },
  detailsBox:{
    display:'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(1,1,1,1),
    margin: theme.spacing(1,0,1,0),
  },
  shippingDetailsBox:{
    marginLeft: theme.spacing(1),
  },
  orderDetailsBox:{
    marginRight: theme.spacing(1),
  },
  orderActionButton:{
    margin: theme.spacing(1,1,1,1),
  },
  alertBox:{
    marginBottom:theme.spacing(1),
  }
}));  

export const useMyAccountStyle = makeStyles((theme) => ({
  paperBox: {
    margin: theme.spacing(1,1,1,1),
    background: '#7ba3fb66',
    padding: theme.spacing(5,1,5,1),
    textAlign: 'center',
  },
}));  