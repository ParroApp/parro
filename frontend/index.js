import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import createHistory from 'history/createBrowserHistory'
import Root from './containers/Root';
import configureStore from './store/configureStore';

const history = createHistory();
const store = configureStore(history);

console.log(history);
console.log(store);

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)


// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import App from './containers/AppContainer'
// import { BrowserRouter, Route, Link } from 'react-router-dom'
// import rootReducer from './reducers/index';
// import Analytics from './components/Analytics';
// import AppContainer from './containers/AppContainer';
// import Login from './components/Login';
// import Register from './components/Register';
// import Code from './components/Code';
// import Behavioral from './components/Behavioral';
// import Technical from './components/Technical';
// import End from './components/End';
// import Timer from './components/Timer';
// import Question from './components/Question';
// import Landing from './components/Landing';

// import 'bulma/css/bulma.css';



// const store = createStore(
//   rootReducer
// );

// render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <div>
//         <Route path='/home' component={Landing} />
//         <Route path='/end' component={End} />
//         <Route path='/technical' component={Technical} />
//         <Route path='/behavioral' component={Behavioral} />
//         <Route path='/question' exact component={Question} />
//         <Route path='/:id/home' exact component={Analytics} />
//         <Route path='/code' exact component={Code} />
//       </div>
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root')
// );
