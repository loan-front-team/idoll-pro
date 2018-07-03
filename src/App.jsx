import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import 'babel-polyfill';

import Login from 'container/login';
// import Dashboard from 'container/dashboard';
import BasicLayout from 'container/basic-layout';
import User from 'container/user';
import Content from 'container/Content';
import '../style/reset.less';

const NotFound = () => (<Content title='404' text='抱歉，你访问的页面不存在' />)

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path='/' component={BasicLayout} />
        <Route exact path='/login' component={Login} />
        <BasicLayout>
          <Route path='/dashboard/user-group' component={User} />
        </BasicLayout>
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>)
export default App;
