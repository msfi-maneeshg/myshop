import React from 'react';
import {Login as AdminLogin} from './admin/login'
import {Dashboard as AdminDashboard} from './admin/dashboard'
import {ChangePassword as AdminChangePassword} from './admin/change-password'
import {AddProductDetails as AdminAddProductDetails} from './admin/product/add-product'
import {Products as AdminProductsList} from './admin/product/products'
import { AllOrders as AdminOrderList } from './admin/order/order'
import { OrderDetails as AdminOrderDetails } from './admin/order/order-detail'
import {Category as AdminProductCategory} from './admin/category'
import { Home } from './front/home'
import {ProductList} from './front/products/product-list'
import {ProductFullDetails} from './front/products/product-info'
import { Cart as UserCart } from './front/cart'
import { Checkout as CheckoutPage } from './front/checkout'
import {LoginPage as FrontLogin} from './front/login'
import {RegisterPage as FrontRegister} from './front/register'
import {MyOrders} from './front/my-orders';
import {MyProfile} from './front/my-profile'
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import {useSelector} from 'react-redux'
function App() {
  const loginStatus = useSelector((state) => state.checkLoginStatus);
  
  return <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/admin/login">
          <AdminLogin />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/product-list/:listType">
          <ProductList />
        </Route>
        <Route exact path="/product-details/:productID">
          <ProductFullDetails />
        </Route>
        <Route exact path="/my-cart">
          <UserCart />
        </Route>
        <Route exact path="/checkout">
          <CheckoutPage />
        </Route>
        <Route exact path="/login">
          <FrontLogin />
        </Route>
        <Route exact path="/register">
          <FrontRegister />
        </Route>
        <Route exact path="/my-orders">
          <MyOrders />
        </Route>
        <Route exact path="/my-profile">
          <MyProfile />
        </Route>
        {loginStatus.isLoggedin?
        <>
        <Route exact path="/admin">
          <AdminDashboard/>
        </Route>
        
        <Route exact path="/admin/order">
          <AdminOrderList />
        </Route>
        <Route exact path="/admin/order/:type">
          <AdminOrderList />
        </Route>
        <Route exact path="/admin/order-details/:orderID">
          <AdminOrderDetails />
        </Route>
        <Route exact path="/admin/product/list">
          <AdminProductsList />
        </Route>
        <Route exact path="/admin/product/add">
          <AdminAddProductDetails />
        </Route>
        <Route exact path="/admin/product/edit/:productID">
          <AdminAddProductDetails />
        </Route>
        <Route exact path="/admin/change-password">
          <AdminChangePassword />
        </Route>
        <Route exact path="/admin/category">
          <AdminProductCategory/>
        </Route>
        </>:
        <Route path="/admin">
          <AdminLogin />
        </Route>
        }
        
        
      </Switch>
    </BrowserRouter>
  </>;
  
}


export default App;
