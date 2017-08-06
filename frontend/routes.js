import React from 'react'
import { Route } from 'react-router'
import Analytics from './components/Analytics';
import Code from './components/Code';
import Behavioral from './components/Behavioral';
import Technical from './components/Technical';
import End from './components/End';
import Timer from './components/Timer';
import Question from './components/Question';
import Landing from './components/Landing';

const Routes = () => (
  <div>
    <Route path='/' exact component={Landing} />
    <Route path='/end' component={End} />
    <Route path='/technical' component={Technical} />
    <Route path='/question' exact component={Question} />
    <Route path='/:id/home' exact component={Analytics} />
    <Route path='/code' exact component={Code} />
    <Route path='/platform' component={Behavioral} />
  </div>
);

export default Routes;
