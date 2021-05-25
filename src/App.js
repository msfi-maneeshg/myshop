import React from 'react';
import {Login as AdminLogin} from './admin/login'
import {Dashboard as AdminDashboard} from './admin/dashboard'
import {ChangePassword as AdminChangePassword} from './admin/change-password'
import {AddProductDetails as AdminAddProductDetails} from './admin/product/add-product'
import {Products as AdminProductsList} from './admin/product/products'
import { AllOrders as AdminOrderList } from './admin/order/order'
import { OrderDetails as AdminOrderDetails } from './admin/order/order-detail'
import { Home } from './front/home'
import {ProductList} from './front/products/product-list'
import {ProductFullDetails} from './front/products/product-info'
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
        <Route exact path="/product-list">
          <ProductList />
        </Route>
        <Route exact path="/product-details/:productID">
          <ProductFullDetails />
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
