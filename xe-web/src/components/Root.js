import React, { Component } from 'react';
import Products from './Products'
import Filter from './Filter'
import Basket from './Basket'

class Root extends Component {
  render () {
    return (
     <div className="container">
       <h1>Xen Electronic</h1>
       <hr />
       <div className="row">
         <div className="col-md-9">
           <Filter />
           <hr />
           <Products />
         </div>
         <div className="col-md-3">
           <Basket />
         </div>
       </div>
     </div>
    );
  }
}

export default Root;
