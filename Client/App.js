
import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';

import LoginScreen from './components/Login';
import RegisterScreen from './components/Register';
import HomeScreen from './components/Home';
import GetLocationScreen from './components/GetLocation';
import AuthenticatedScreen from './components/Authenticated.js'
import deviceStorage from './components/Storage';

const MainNavigator = createStackNavigator({
  Home:{screen: HomeScreen},
  Register:{screen: RegisterScreen},
  Login:{screen: LoginScreen},
  GetLocation:{screen: GetLocationScreen},
  Authenticated: { screen: AuthenticatedScreen }
})

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      jwt: '',
      loading: true
    }
    
    this.newJWT = this.newJWT.bind(this);
    this.loadJWT = deviceStorage.loadJWT.bind(this);
    this.loadJWT();
  }

  newJWT(jwt){
    this.setState({
      jwt: jwt
    });
  }

  render() {
    return <AppContainer newJWT={this.newJWT} />;
  }
}
