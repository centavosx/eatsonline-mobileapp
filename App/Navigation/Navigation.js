import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/Login';

const NavigationStack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <NavigationStack.Navigator>
                <NavigationStack.Screen name='Login' component={LoginScreen} />
            </NavigationStack.Navigator>
        </NavigationContainer>
    )
};
export default Navigation;