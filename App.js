import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './App/Navigation/MainTab';
import LoginScreen from './App/Screens/Login';
import RegisterScreen from './App/Screens/Registration';
import OnBoardScreen from './App/Screens/OnBoard';
import ProductScreen from './App/Screens/ProductDetails';
import AddCartScreen from './App/Screens/AddCart';
import Checkout from './App/Screens/Checkout';
import SupportChat from './App/Screens/SupportChat'
import Navigation from './App/Navigation/Navigation';

const NavigationStack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <NavigationStack.Navigator>
        <NavigationStack.Screen name='OnBoard' component={OnBoardScreen} options={{ headerShown: false }} />
        <NavigationStack.Screen name='Home1' component={MainTabs} options={{ headerShown: false }} />
        <NavigationStack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <NavigationStack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }} />
        <NavigationStack.Screen name='Product' component={ProductScreen} options={{ headerShown: false }} />
        <NavigationStack.Screen name='AddCart' component={AddCartScreen} options={{ headerShown: false }} />
        <NavigationStack.Screen name='Checkout' component={Checkout} options={{ headerShown: false }} />
        <NavigationStack.Screen name='SupportChat' component={SupportChat} options={{ headerShown: false }} />
      </NavigationStack.Navigator>
    </NavigationContainer>
  )
}
export default App;

