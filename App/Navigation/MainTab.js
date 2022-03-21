import React from 'react';
import { View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../Screens/Home';
import FeatureScreen from '../Screens/Featured';
import NotificationScreen from '../Screens/Notification';
import ProfileScreen from '../Screens/Profile';
import LoginScreen from '../Screens/Login';
import AddCartScreen from '../Screens/AddCart';
import { TabActions } from '@react-navigation/routers';

const HomeStack = createStackNavigator();
const FeatureStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const NavigationStack = createStackNavigator();


const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                style: {
                    height: 55,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarActiveTintColor: '#1C9F99',
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="home-filled" color={color} size={30} />,
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                }}
            />
            <Tab.Screen
                name="Feature"
                component={FeatureScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="local-mall" color={color} size={30} />,
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="notifications" color={color} size={30} />,
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <Icon name="person" color={color} size={30} />,
                    headerShown: false,
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                }}
            />
        </Tab.Navigator>
    )
};
export default MainTabs;
