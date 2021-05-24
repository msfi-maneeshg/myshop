import React,{useState} from 'react';
import {useSelector , useDispatch} from 'react-redux';
import {changeLoginStatus} from './reducers';
import clsx from 'clsx';
import {useClasses} from './style';
import {Link} from 'react-router-dom';
import  logo from '../images/logo.png' ;
import {
    AppBar,
    Typography,
    Toolbar,
    Button,
    IconButton ,Badge ,InputBase,
    Menu,Fade ,MenuItem
} from '@material-ui/core';
import {
    ShoppingCart,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Mail as MailIcon,
    MoreVert as MoreIcon ,
} from '@material-ui/icons';
export function Header(){
  const classes = useClasses();
  const [profileButton, setProfileButton] = useState(null);
  const dispatch = useDispatch()
  const userLoginDetails = useSelector((state) => state.checkLoginStatus);
  

  const handleMyProfileClick = (event) => {
    setProfileButton(event.currentTarget);
  };

  const handleMyProfileClose = () => {
    setProfileButton(null);
  };

  return(
      <AppBar
        position="fixed"
        className={classes.header}
      >
      <Toolbar>
        <Link to="/">
          <img src={logo} className={classes.logo}/>
        </Link>
        <div className={classes.headerSearch}>
          <div className={classes.headerSearchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              input: classes.headerSearchInput,
            }}
          />
        </div>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          {
          userLoginDetails.isLoggedin?
            <>
              <Button variant="outlined" onClick={handleMyProfileClick}>My Profile</Button>
              <Menu
                id="profile-menu"
                anchorEl={profileButton}
                keepMounted
                open={Boolean(profileButton)}
                onClose={handleMyProfileClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleMyProfileClose}>My Profile</MenuItem>
                <MenuItem onClick={handleMyProfileClose}>My Orders</MenuItem>
                <MenuItem onClick={() => dispatch(changeLoginStatus())}>Logout</MenuItem>
              </Menu>
            </>
          :
            <Button variant="outlined">Login</Button>
          }
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
          >
              <Badge badgeContent={17} color="secondary">
                  <ShoppingCart />
              </Badge>
            
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
