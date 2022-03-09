import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import AccountPage from './pages/AccountPage';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import NoMatch from './components/NoMatch';

const initialState = {};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    const isAuthenticated = !!this.props.accessToken && !!this.props.userId;

    return (
      <div className="App">
        <Header authenticated={isAuthenticated} />
        <Switch>
          <PublicRoute restricted={isAuthenticated ? true : false} component={HomePage} path="/register" exact />
          <PublicRoute restricted={isAuthenticated ? true : false} component={LoginPage} path="/login" exact />
          <PrivateRoute component={AccountPage} path="/account" exact />
          <PrivateRoute component={CalendarPage} path="/" exact />
          <PublicRoute restricted={false} component={NoMatch} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken,
    userId: state.auth.userId
  };
};

export default connect(mapStateToProps)(App);
