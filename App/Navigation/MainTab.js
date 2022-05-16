import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/MaterialIcons'
import HomeScreen from '../Screens/Home'
import FeatureScreen from '../Screens/Featured'
import NotificationScreen from '../Screens/Notification'
import ProfileScreen from '../Screens/Profile'
import LoginScreen from '../Screens/Login'
import AddCartScreen from '../Screens/AddCart'
import { TabActions } from '@react-navigation/routers'
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import socket from '../../socket'

const Tab = createBottomTabNavigator()

const MainTabs = (props) => {
  const [data, setData] = useState({})
  const [advanced, setAdvanced] = useState([])
  const [order, setOrder] = useState([])
  const [notifData, setNotifData] = useState([])
  const [cartItem, setCartItems] = useState([])
  const [header, setHeader] = useState(null)
  React.useEffect(async () => {
    const response = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/profileData?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
          data: [
            'name',
            'address',
            'email',
            'phoneNumber',
            'addresses',
            'guest',
            'img',
          ],
        })
      )}`
    )
    const req = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/notif?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
        })
      )}`
    )
    const resp2 = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/cartItem?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
        })
      )}`
    )
    response.data = decryptJSON(response.data.data)
    if (!response.data.error) {
      setData(response.data)
    } else {
      setData({ name: '' })
    }
    setNotifData(
      decryptJSON(req.data.data).filter(
        (data) =>
          data[1].status !== 'Completed' && data[1].status !== 'Cancelled'
      )
    )
    resp2.data = decryptJSON(resp2.data.data)
    setCartItems(resp2.data.data)
    socket.emit('userinfo', await AsyncStorage.getItem('id'))
    socket.emit('notifications', await AsyncStorage.getItem('id'))
    socket.on(`transact/${await AsyncStorage.getItem('id')}`, (data) => {
      setOrder(data)
    })
    socket.on(`advanced/${await AsyncStorage.getItem('id')}`, (data) => {
      setAdvanced(data)
    })
    socket.emit(`userinfocart`, await AsyncStorage.getItem('id'))
    socket.on(`cart/${decrypt(await AsyncStorage.getItem('id'))}`, (data) => {
      setCartItems(data)
    })

    socket.emit('userinfo', await AsyncStorage.getItem('id'))
    socket.on(`user/${decrypt(await AsyncStorage.getItem('id'))}`, (data) => {
      setData(data)
    })
  }, [])

  React.useEffect(() => {
    setNotifData(
      [...order, ...advanced].filter(
        (data) =>
          data[1].status !== 'Completed' && data[1].status !== 'Cancelled'
      )
    )
  }, [order, advanced])
  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            {header === null ? (
              <>
                <Text style={styles.Text}>Hello, </Text>
                <Text style={styles.UserText}>
                  {data.name?.substr(0, 15)}{' '}
                  {data.name ? (data.name.length > 15 ? '...' : null) : null}
                </Text>
              </>
            ) : (
              <Text style={styles.UserText}>{header}</Text>
            )}
          </View>
        </View>
        <Image
          style={styles.UserImage}
          source={
            data.img
              ? { uri: data.img }
              : require('../../assets/EOLogoYellowGlow.png')
          }
        />
      </View>
      <Tab.Navigator
        screenOptions={{
          style: {
            height: 55,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarActiveTintColor: '#1C9F99',
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home-filled" color={color} size={30} />
            ),
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: 'bold',
            },
          }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              cart={cartItem}
              header={(v) => setHeader(v)}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Menu"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="local-mall" color={color} size={30} />
            ),
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: 'bold',
            },
          }}
        >
          {(props) => (
            <FeatureScreen
              {...props}
              cart={cartItem}
              header={(v) => setHeader(v)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Notification"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={{ flexDirection: 'row' }}>
                <Icon name="notifications" color={color} size={30} />
                {notifData.length > 0 ? (
                  <Text style={{ left: -5, color: 'red' }}>
                    {notifData.length}
                  </Text>
                ) : null}
              </View>
            ),
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: 'bold',
            },
          }}
        >
          {(props) => (
            <NotificationScreen
              {...props}
              notifications={notifData}
              header={(v) => setHeader(v)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="person" color={color} size={30} />
            ),

            tabBarLabel: 'Profile',

            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: 'bold',
            },
          }}
        >
          {(properties) => (
            <ProfileScreen
              {...properties}
              setLogin={(v) => props.setLogin(v)}
              header={(v) => setHeader(v)}
              user={data}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  Text: {
    fontSize: 20,
  },
  UserText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  TextIntro: {
    marginTop: 5,
    fontSize: 18,
    color: 'grey',
  },
  UserImage: {
    height: 40,
    width: 40,
    marginTop: -5,
    borderRadius: 25,
    marginBottom: 10,
    borderColor: 'black',
  },
})

export default MainTabs
