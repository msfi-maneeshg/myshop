import React from 'react';
import {Login as AdminLogin} from './admin/login'
import {Dashboard as AdminDashboard} from './admin/dashboard'
import {AddProductDetails as AdminAddProductDetails} from './admin/product/add-product'
import {Products as AdminProductsList} from './admin/product/products'
import {
  AllOrders as AdminOrderList,
  CompletedOrders as AdminCompletedOrderList,
  PendingOrders as AdminPendingOrderList,
} from './admin/order/order'
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
function App() {
  const isLoggedin = true;
  return <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/admin">
          {isLoggedin?<AdminDashboard/>:<AdminLogin />}
        </Route>
        <Route exact path="/admin/login">
          <AdminLogin />
        </Route>
        <Route exact path="/admin/order/list">
          <AdminOrderList />
        </Route>
        <Route exact path="/admin/order/completed">
          <AdminCompletedOrderList />
        </Route>
        <Route exact path="/admin/order/pending">
          <AdminPendingOrderList />
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
        
        
      </Switch>
    </BrowserRouter>
  </>;
  
}


export default App;
