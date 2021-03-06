import React,{ useState} from 'react';
import {useSelector , useDispatch} from 'react-redux';
import {changeLoginStatus} from './reducers';
import {useClasses} from './style';
import {Link} from 'react-router-dom';
import  logo from '../images/logo.png' ;
import {
    AppBar,
    Toolbar,
    Button,
    IconButton ,Badge ,InputBase,
    Menu,Fade ,MenuItem
} from '@material-ui/core';
import {
    ShoppingCart,
    Search as SearchIcon,
} from '@material-ui/icons';

export function Header(props){
  const userLoginDetails = useSelector((state) => state.checkLoginStatus);
  const userCartInfo = useSelector((state) => state.GetUserCartInfo);
  const classes = useClasses();
  const [profileButton, setProfileButton] = useState(null);
  const dispatch = useDispatch()

  const cartProps = userCartInfo;

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
        <Link to="/" className={classes.link}>
          <img src={logo} alt={logo} className={classes.logo}/>
        </Link>
        {!props.showLogoOnly&&
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
        </div>}
        <div className={classes.grow} />
        {!props.showLogoOnly && <div className={classes.sectionDesktop}>
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
                <Link className={classes.link} to='/my-profile'><MenuItem>My Profile</MenuItem></Link>
                <Link className={classes.link} to='/my-orders'><MenuItem> My Orders</MenuItem></Link>
                <MenuItem onClick={() => dispatch(changeLoginStatus())}>Logout</MenuItem>
              </Menu>
            </>
          :
            <Link className={classes.link} to='/login'><Button variant="outlined">Login</Button></Link>
          }
          <Link to="/my-cart" className={classes.link}>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
            
          >
            {cartProps && cartProps.items && cartProps.items.length > 0?
              <Badge badgeContent={cartProps.items.length} color="secondary">
                  <ShoppingCart />
              </Badge>:<ShoppingCart />
            }
            
          </IconButton>
          </Link>
        </div>}
      </Toolbar>
    </AppBar>
  );
}
