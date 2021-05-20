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
    Divider,
    Collapse,
} from '@material-ui/core';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    AppsSharp as DashboardIcon,
    AccountCircleSharp as AdminIcon,
    PowerSettingsNew as LogoutIcon,
    ShoppingCart as OrderIcon,
    StorefrontSharp as ProductIcon,
    ExpandLess,
    ExpandMore,
    Add as AddIcon,
    List as ListIcon, 
} from '@material-ui/icons';
import { useState } from 'react';
import {Link} from 'react-router-dom';
export function Sidebar(props){
    const classes = useStyles();
    const theme = useTheme();
    const sidebarStatus = useSelector((state) => state.checkSidebarStatus);
    const isSidebarShow = sidebarStatus.isShow;
    const dispatch = useDispatch();
    const [isProductListOpen,setIsProductListOpen] = useState(props.menu === 'product');
    const [isOrderListOpen,setIsOrderListOpen] = useState(props.menu === 'order');

    

    const openListSubMenu = (menuName) => {
        switch(menuName){
          case "product":
            setIsProductListOpen(!isProductListOpen);
            break;
          case "order":
            setIsOrderListOpen(!isOrderListOpen);
            break; 
          default:
            break;
        }
    }
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
            <Link to="/admin" className={classes.link}>
              <ListItem button key="home" selected={props.isDashboard}>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>
            <Link to="/admin/order" className={classes.link} >
              <ListItem button key="order" selected={props.menu === 'order'}>
                <ListItemIcon><OrderIcon /></ListItemIcon>
                <ListItemText primary="Orders" />
                {isOrderListOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </Link>
            <ListItem button key="product" onClick={() => openListSubMenu('product')} selected={props.menu === 'product'}>
              <ListItemIcon><ProductIcon /></ListItemIcon>
              <ListItemText primary="Products" />
              {isProductListOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={isProductListOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link to="/admin/product/list" className={classes.link} >
                  <ListItem button className={classes.subMenu} selected={props.subMenu === 'product:list'}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Product" />
                  </ListItem>
                </Link>
                <Link to="/admin/product/add" className={classes.link}>
                  <ListItem  button className={classes.subMenu} selected={props.subMenu === 'product:add'}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="New Product" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
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