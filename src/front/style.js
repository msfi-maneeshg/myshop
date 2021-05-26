import { fade,makeStyles } from '@material-ui/core/styles';
export const useClasses = makeStyles((theme) => ({
    header:{
        background:'#ebeeff',
        color: 'black',
    },
    logo:{
        maxHeight:'50px'
    },
    headerSearch:{
        display:'flex',
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#3368af94", 0.15),
        '&:hover': {
        backgroundColor: fade("#3368af", 0.25),
        },
        margin:theme.spacing(0,5,0,5),
    },
    headerSearchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSearchInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
    },
    grow: {
        flexGrow: 1,
    },
    mainContainer:{
        // background: '#dedede7a',
        padding:theme.spacing(3,1,3,1),
    },
    productInfo:{
        textAlign:'center',
        minHeight:'35vh',
        background:'#0000ff14',
        margin:theme.spacing(1,1,1,1),
        padding:theme.spacing(1,1,1,1),
        '&:hover':{
            background:'#0000ff29',
            color:'#003eca',
        },
    },
    productInfoImage:{
        maxWidth: '100%',
        maxHeight: '25vh',
    },
    productImageBox:{
        height:'25vh',
    },
    productNameBox:{
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    },
    bannerImage:{
        maxWidth: '100%',
        maxHeight: '100%',
    },
    link:{
        textDecoration:'none',
        cursor:'pointer',
    },
    productPrizeBox:{
        display:'flex',
        maxWidth:'100%',
    },
    productPrize:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontFamily: 'sans-serif',
        fontSize: 'larger',
        flexGrow: '1',
    },
    productMRP:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontSize: 'smaller',
        textDecoration: 'line-through',
        flexGrow: '1',
    },
    productDiscount:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontSize: 'smaller',
        color:'crimson',
        flexGrow: '1',
        fontWeight: 'bold',
    },
}))

export const useLoginModalStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1,1,1,1),
    },
}));

export const useLoginStyles = makeStyles((theme) => ({
    inputBox: {
      margin: theme.spacing(1),
      width: '35ch',
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    }
}));

export const useDealOfTheDay = makeStyles((theme) => ({
    dealOfTheDayMain:{
        padding:theme.spacing(1,1,1,1),
    },
    headingBox:{
        width:'100%',
        display:'flex',
    }
}));

export const useEssentialsDeals = makeStyles((theme) => ({
    main:{
        padding:theme.spacing(1,1,1,1),
    },
    headingBox:{
        width:'100%',
        display:'flex',
    }
}));

export const useCategoryProducts = makeStyles((theme) => ({
    main:{
        padding:theme.spacing(1,1,1,1),
    },
    headingBox:{
        width:'100%',
        display:'flex',
    }
}));

export const useFilterSidebar = makeStyles((theme) => ({
    main:{
        padding:theme.spacing(1,1,1,1),
    },
    headingBox:{
        width:'100%',
        display:'flex',
    },
    prizeRangeInput:{
        width:'100%',
        display:'flex',
    },
    prizeRangeInputText:{
        margin:theme.spacing(1,1,1,1),
        textAlign: 'center',
        maxHeight: '100%',
    }
}));

export const useProductList = makeStyles((theme) => ({
    main:{
        padding:theme.spacing(1,1,1,1),
    },
    headingBox:{
        width:'100%',
        display:'flex',
    }
}));

export const useProductDetailsClasses = makeStyles((theme) => ({
    main:{
        padding:theme.spacing(1,1,1,1),
    },
    fullImageBox:{
        
        textAlign: 'center',
        minHeight: '50vh',
    },
    fullImage:{
        margin:theme.spacing(1,1,1,1),
        maxWidth:'100%',
        maxHeight:'50vh',
    },
    imageSliderBox:{
        maxWidth:'100%',
        minHeight:'15vh',
    },
    smallImage:{
        maxWidth:'100%',
        maxHeight:'100%',
    },
    smallImageBox:{
        maxWidth:'100%',
        height:'15vh',
        textAlign:'center',
        cursor:'pointer',
        '&:hover':{
            border:'1px solid',
            padding:'1px'
        },
    },
    productPrizeBox:{
        display:'flex',
        maxWidth:'100%',
    },
    productPrize:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontFamily: 'sans-serif',
        fontSize: 'xx-large',
    },
    productMRP:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontSize: 'larger',
        textDecoration: 'line-through',
        marginLeft:theme.spacing(1),
    },
    productDiscount:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontSize: 'larger',
        color:'crimson',    
        fontWeight: 'bold',
        marginLeft:theme.spacing(1),
    },
    productDescription:{
        whiteSpace:'break-spaces',
    },
    buttonsBox:{
        display:'flex',
        marginBottom:theme.spacing(2),
    },
    buyButtonsBox:{
        width:'50%',
        padding:theme.spacing(0,1,0,1),
    },
    buyButtons:{
        width:'100%',
        color: 'white',
        fontWeight: 'bold',
        padding: theme.spacing(2),
        background: '#ef3700d1',
        '&:hover':{
            color: 'white',
            background: '#ef3700d1',
        }
    },
    addButtons:{
        width:'100%',
        color: 'white',
        fontWeight: 'bold',
        padding: theme.spacing(2),
        background: '#ff9f00',
        '&:hover':{
            color: 'white',
            background: '#ff9f00',
        }
    },
    
}));

export const useCartClasses = makeStyles((theme) => ({
    heading:{
        
    },
    outerBox:{
        padding:theme.spacing(1,1,1,1),
    },
    placeOrderButtons:{
        minWidth:'30%',
        maxWidth:'50%',
        color: 'white',
        fontWeight: 'bold',
        padding: theme.spacing(2),
        background: '#fb641b',
        '&:hover':{
            color: 'white',
            background: '#fb641b',
        }
    },
    placeOrderBox:{
        display:'flex',
    },
    imageBox:{
        width:'100%',
        height:'15vh',
        textAlign:'center',
    },
    productImage:{
        maxWidth:'100%',
        maxHeight:'100%',
    },
    quantityButtons:{
        textAlign:'center',
    },
    productPrizeBox:{
        display:'flex',
        maxWidth:'100%',
    },
    productPrize:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontFamily: 'sans-serif',
        fontSize: 'xx-large',
    },
    productMRP:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontSize: 'larger',
        textDecoration: 'line-through',
        marginLeft:theme.spacing(1),
    },
    productDiscount:{
        padding:theme.spacing(.125,.125,.125,.125),
        fontSize: 'larger',
        color:'crimson',    
        fontWeight: 'bold',
        marginLeft:theme.spacing(1),
    },
    emptyCartOuterBox:{
        padding:theme.spacing(1,1,1,1),
        height:'80vh',
    },
    emptyCartBox:{
        textAlign:'center',
        left: '40%',
        top: '40%',
        position: 'absolute'
    },
    emptyCartIcon:{
        fontSize:'100px',
        color:'#3062a6',
    }
}));