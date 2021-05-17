import React from 'react';
import {Login as AdminLogin} from './admin/login'
import {Dashboard as AdminDashboard} from './admin/dashboard'
import {AddProduct as AdminAddProduct} from './admin/product/add-product'
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
        <Route exact path="/admin/product/add">
          <AdminAddProduct />
        </Route>
      </Switch>
    </BrowserRouter>
  </>;
  
}


export default App;
