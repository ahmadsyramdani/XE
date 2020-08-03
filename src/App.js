import React from 'react';
import { Provider } from 'react-redux';
import Root from './components/Root'
import Checkout from './components/Checkout'
import NotFound from './components/NotFound'
import SuccessCheckout from './components/SuccessCheckout'
import Error from './components/Error'
import store from './store';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Root} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/success" component={SuccessCheckout} />
          <Route path="/error" component={Error} />
          <Route path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
