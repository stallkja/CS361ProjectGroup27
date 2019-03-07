import { createStackNavigator, createAppContainer } from 'react-navigation';

import LoginScreen from './components/Login';
import RegisterScreen from './components/Register';
import HomeScreen from './components/Home';
import GetLocationScreen from './components/GetLocation';

const MainNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    Register: { screen: RegisterScreen },
    Login: { screen: LoginScreen },
    GetLocation: { screen: GetLocationScreen },
})

const App = createAppContainer(MainNavigator);
export default App;