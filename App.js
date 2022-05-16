import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabs from './App/Navigation/MainTab'
import LoginScreen from './App/Screens/Login'
import RegisterScreen from './App/Screens/Registration'
import OnBoardScreen from './App/Screens/OnBoard'
import ProductScreen from './App/Screens/ProductDetails'

import Checkout from './App/Screens/CO'
import SupportChat from './App/Screens/SupportChat'
import Navigation from './App/Navigation/Navigation'
import Loading from './App/Screens/Loading'
import { ForgotPass, VerifyEmail } from './App/Screens/Login'
import Transaction from './App/Screens/Trasaction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { decrypt, decryptJSON, encrypt, encryptJSON } from './Encryption'

const NavigationStack = createNativeStackNavigator()

const App = () => {
  const [login, setLogin] = useState(null)
  React.useEffect(async () => {
    const id = await AsyncStorage.getItem('id')
    if (id === null) return setLogin(false)
    try {
      const resp = await axios.get(
        'https://eats-apionline.herokuapp.com/api/v1/profileData',
        {
          params: {
            data: JSON.stringify(
              encryptJSON({
                id: id,
                data: ['name'],
              })
            ),
          },
        }
      )

      resp.data = decryptJSON(resp.data.data)
      if (!resp.data.error) {
        setLogin(resp.data.name.length > 0)
      } else {
        setLogin(false)
      }
    } catch (e) {
      setLogin(false)
    }
  }, [])

  if (login === null) return <Loading />
  if (login)
    return (
      <NavigationContainer>
        <NavigationStack.Navigator>
          <NavigationStack.Screen name="Home1" options={{ headerShown: false }}>
            {(props) => <MainTabs {...props} setLogin={(v) => setLogin(v)} />}
          </NavigationStack.Screen>
          <NavigationStack.Screen
            name="Transaction"
            options={{ headerShown: false }}
            component={Transaction}
          />
          <NavigationStack.Screen
            name="Product"
            component={ProductScreen}
            options={{ headerShown: false }}
          />

          <NavigationStack.Screen
            name="Checkout"
            component={Checkout}
            options={{ headerShown: false }}
          />
          <NavigationStack.Screen
            name="SupportChat"
            component={SupportChat}
            options={{ headerShown: false }}
          />
        </NavigationStack.Navigator>
      </NavigationContainer>
    )
  return (
    <NavigationContainer>
      <NavigationStack.Navigator>
        <NavigationStack.Screen
          name="OnBoard"
          component={OnBoardScreen}
          options={{ headerShown: false }}
        />

        <NavigationStack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <LoginScreen {...props} setLogin={(v) => setLogin(v)} />}
        </NavigationStack.Screen>

        <NavigationStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <NavigationStack.Screen
          name="Forgot Pass"
          component={ForgotPass}
          options={{ headerShown: false }}
        />
        <NavigationStack.Screen name="Verify" options={{ headerShown: false }}>
          {(props) => <VerifyEmail {...props} setLogin={(v) => setLogin(v)} />}
        </NavigationStack.Screen>
      </NavigationStack.Navigator>
    </NavigationContainer>
  )
}
export default App
