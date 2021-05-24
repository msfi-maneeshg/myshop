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
    },
    productInfoImage:{
        maxWidth: '100%',
        maxHeight: '100%',
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
    productPrizeBox:{
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    }
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