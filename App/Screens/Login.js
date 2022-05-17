import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'

import image1 from '../../assets/EOLogoYellowGlow.png'
import FormInput from '../Components/FormInput'
import FormButton from '../Components/FormButton'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { decryptJSON, decrypt, encrypt, encryptJSON } from '../../Encryption'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import sha256 from 'crypto-js/sha256'
const navigation = navigation

const Login = ({ navigation, setLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  useFocusEffect(
    React.useCallback(() => {
      setEmail('')
      setError('')
      setPassword('')
    }, [])
  )
  const guest = async () => {
    axios
      .post(
        'https://eats-apionline.herokuapp.com/api/v1/guest',
        {},
        { headers: { Accept: '*/*' } }
      )
      .then(async (response) => {
        response.data = decryptJSON(response.data.data)
        if (!response.data.error) {
          if (response.data.registered) {
            await AsyncStorage.setItem('id', response.data.id)
            setLogin(true)
          }
        }
      })
  }

  const loginUser = async () => {
    const resp = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/login?data=${JSON.stringify(
        encryptJSON({
          email: email,
          password: sha256(password).toString(),
        })
      )}`
    )

    let data = decryptJSON(resp.data.data)

    if (!data.error) {
      if ('id' in data) {
        if (data.login) {
          await AsyncStorage.setItem('id', data.id)
          setLogin(true)
        } else {
          navigation.navigate('Verify', {
            id: data.id,
            name: data.name,
            email: email,
          })
        }
      } else {
        setError(data.message)
      }
    } else {
      setError(data.message)
    }
  }
  return (
    <View style={styles.container}>
      <Image source={image1} style={styles.logo} />
      <Text style={styles.text}>Eats Online PH</Text>
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      {error.length > 0 ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Forgot Pass')}
      >
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>
      <FormButton
        buttonTitle="Sign In"
        onPress={async () => await loginUser()}
      />
      <Text style={{ marginTop: 10 }}>Or</Text>
      <FormButton
        buttonTitle="Sign In As Guest"
        onPress={async () => await guest()}
      />

      <TouchableOpacity style={styles.forgotButton}>
        <Text
          style={styles.navButtonText}
          onPress={() => navigation.navigate('Register')}
        >
          Don't have an acount? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export const ForgotPass = ({ navigation, setLogin, route }) => {
  const [email, setEmail] = useState('')
  const [rmessage, setRmess] = useState('')
  useFocusEffect(
    React.useCallback(() => {
      setEmail('')
      setRmess('')
    }, [])
  )
  const resetP = async () => {
    const resp = await axios.patch(
      'https://eats-apionline.herokuapp.com/api/v1/forgetPass',
      encryptJSON({
        email: email,
      })
    )
    setRmess(decryptJSON(resp.data.data).message)
  }

  return (
    <View style={styles.container}>
      <Image source={image1} style={styles.logo} />
      <Text style={styles.text}>Reset Password</Text>
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.navButtonText}>{rmessage}</Text>

      <FormButton
        buttonTitle="Reset Pass"
        onPress={async () => await resetP()}
      />
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.navButtonText} onPress={() => navigation.goBack()}>
          Back
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.buttonText} onPress={() => navigation.navigate("Profile")}>Back</Text>
            </TouchableOpacity> */}
    </View>
  )
}
export const VerifyEmail = ({ navigation, setLogin, route }) => {
  const [code, setCode] = useState('')
  const [rmessage, setMessage] = useState('')
  const [color, setColor] = useState({ color: 'green' })
  useFocusEffect(
    React.useCallback(() => {
      setCode('')
      setMessage('')
      setColor({ color: 'green' })
    }, [])
  )
  const verifyAccount = async () => {
    const response = await axios.patch(
      'https://eats-apionline.herokuapp.com/api/v1/verify',
      encryptJSON({
        id: route.params.id,
        code: code,
      })
    )
    response.data = decryptJSON(response.data.data)
    if (!response.data.error) {
      if (response.data.verified) {
        setColor({ color: 'green' })
        await AsyncStorage.setItem('id', route.params.id)
        setLogin(true)
      } else {
        setColor({ color: 'red' })
      }
    } else {
      setColor({ color: 'red' })
    }
    setMessage(response.data.message)
  }

  const reverify = async () => {
    const response = await axios.patch(
      'https://eats-apionline.herokuapp.com/api/v1/reverify',
      encryptJSON({
        id: route.params.id,
        name: route.params.name,
        email: route.params.email,
      })
    )

    response.data = decryptJSON(response.data.data)
    if (!response.data.error) {
      if (response.data.sent) {
        setColor({ color: 'green' })
      } else {
        setColor({ color: 'red' })
      }
    } else {
      setColor({ color: 'red' })
    }

    setMessage(response.data.message)
  }

  return (
    <View style={styles.container}>
      <Image source={image1} style={styles.logo} />
      <Text style={styles.text}>Verify</Text>
      <FormInput
        labelValue={code}
        onChangeText={(c) => setCode(c)}
        placeholderText="Verification Code"
        iconType="check"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {rmessage.length > 0 ? <Text style={color}>{rmessage}</Text> : null}
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={async () => await reverify()}
      >
        <Text style={styles.navButtonText}>Resend Verification Code</Text>
      </TouchableOpacity>
      <FormButton
        buttonTitle="Verify"
        onPress={async () => await verifyAccount()}
      />
      <TouchableOpacity style={styles.forgotButton}>
        <Text
          style={styles.navButtonText}
          onPress={() => navigation.navigate('Login')}
        >
          Back
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.buttonText} onPress={() => navigation.navigate("Profile")}>Back</Text>
            </TouchableOpacity> */}
    </View>
  )
}
export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#d6faf4',
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
  buttonContainer: {
    height: 50,
    width: 150,
    borderRadius: 50,
    backgroundColor: 'yellow',
    paddingVertical: 10,
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: 'blue',
    fontSize: 20,
  },
})
