import {useSelector,useDispatch } from 'react-redux'
import {showHideSidebar} from './reducers'
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import {useStyles} from './common'
import {
     Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    IconButton,
    Divider
} from '@material-ui/core';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    AppsSharp as DashboardIcon,
    AccountCircleSharp as AdminIcon,
    PowerSettingsNew as LogoutIcon,
    ShoppingCart as OrderIcon,
    StorefrontSharp as ProductIcon,
} from '@material-ui/icons';

export function Sidebar(props){
    const classes = useStyles();
    const theme = useTheme();
    const sidebarStatus = useSelector((state) => state.checkSidebarStatus);
    const isSidebarShow = sidebarStatus.isShow;
    const dispatch = useDispatch();
    return (
        <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: isSidebarShow,
          [classes.drawerClose]: !isSidebarShow,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: isSidebarShow,
            [classes.drawerClose]: !isSidebarShow,
          }),
        }}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton onClick={() => dispatch(showHideSidebar())}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
            <ListItem button key="home" disabled={props.isDashboard}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button key="order" disabled={props.isOrder}>
              <ListItemIcon><OrderIcon /></ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem button key="product" disabled={props.isProduct}>
              <ListItemIcon><ProductIcon /></ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem button key="profile">
              <ListItemIcon><AdminIcon/></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button key="logout">
                <ListItemIcon><LogoutIcon/></ListItemIcon>
                <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    );
}