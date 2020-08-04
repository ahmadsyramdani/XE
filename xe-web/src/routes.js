import React from 'react';

const Checkout = React.lazy(() => import('./components/Checkout'));

const routes = [
  {path: '/', exact: true, name: 'Home'},
  {path: '/checkout', name: 'Checkout', component: Checkout},
];

export default routes;
