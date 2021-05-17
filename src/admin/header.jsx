import {useSelector , useDispatch} from 'react-redux'
import {showHideSidebar} from './reducers'
import clsx from 'clsx';
import {useStyles} from './common'
import {
    AppBar,
    Typography,
    Toolbar,
    IconButton,
} from '@material-ui/core';
import {
    Menu as MenuIcon,
} from '@material-ui/icons';

export function Header(){
    const sidebarStatus = useSelector((state) => state.checkSidebarStatus);
    const dispatch = useDispatch();
    const classes = useStyles();
    
    return(
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
            [classes.appBarShift]: sidebarStatus.isShow,
            })}
        >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => dispatch(showHideSidebar())}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: sidebarStatus.isShow,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            MyShop
          </Typography>
        </Toolbar>
      </AppBar>
    );
}