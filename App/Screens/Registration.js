import React, { useState } from 'react'
import 'react-native-gesture-handler'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import image1 from '../../assets/EOLogoYellowGlow.png'
import FormInput from '../Components/FormInput'
import FormButton from '../Components/FormButton'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import sha256 from 'crypto-js/sha256'
import { decryptJSON, encryptJSON } from '../../Encryption'
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
const NavigationStack = createNativeStackNavigator()
const navigation = navigation

const Registration = ({ navigation }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [style, setStyle] = useState({ color: 'red', fontSize: 12 })
  const [message, setMessage] = useState('')
  useFocusEffect(
    React.useCallback(() => {
      reset()
      setMessage('')
    }, [])
  )
  const signup = async () => {
    let check = validateInput()
    if (check) {
      const response = await axios.post(
        'https://eats-apionline.herokuapp.com/api/v1/register',
        encryptJSON({
          email: email,
          password: sha256(password).toString(),
          phoneNumber: phoneNumber,
          address: address,
          name: name,
        })
      )

      let data = decryptJSON(response.data.data)
      if (!data.error) {
        if (data.registered) {
          setStyle({ color: 'green', fontSize: 12 })
          reset()
        } else {
          setStyle({ color: 'red', fontSize: 12 })
        }
      } else {
        setStyle({ color: 'red', fontSize: 12 })
      }
      setMessage(data.message)
    }
  }
  const reset = () => {
    setName('')
    setAddress('')
    setEmail('')
    setPassword('')
    setPhoneNumber('')
    setConfirmPassword('')
  }
  const checkEmail = (v) => {
    let check =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return check.test(v)
  }
  const checkPhone = (v) => {
    let c = /^(09)\d+$/
    return v.toString().length > 10 ? c.test(v) : false
  }

  const validateInput = () => {
    return (
      name.length > 0 &&
      address.length > 0 &&
      checkPhone(phoneNumber) &&
      checkEmail(email) &&
      checkPass(password) &&
      checkConfAndPass(password, confirmPassword)
    )
  }

  const checkPass = (pass) => {
    let re = /[A-Z]/
    let re2 = /[a-z]/
    let re3 = /[!@#$%^&*\(\)_+\}\{\":?><|~\.\-]/
    let re4 = /[0-9]/

    return (
      re.test(pass) &&
      re2.test(pass) &&
      re3.test(pass) &&
      re4.test(pass) &&
      password.length >= 8
    )
  }
  const checkNum = (v) => {
    let ch = true

    for (let x of v) {
      if (!'01234567890'.includes(x)) {
        ch = false
        break
      }
    }
    return ch
  }
  const checkConfAndPass = (pass, pass2) => {
    return pass === pass2
  }
  return (
    <View style={styles.container}>
      <Image source={image1} style={styles.logo} />
      <Text style={styles.text}>Create an account</Text>
      <FormInput
        labelValue={name}
        onChangeText={(user) => setName(user)}
        placeholderText="Name"
        iconType="user"
        autoCapitalize="none"
        autoCorrect={false}
        avail={!name.length > 0}
        availType={'exclamationcircle'}
      />
      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="mail"
        autoCapitalize="none"
        autoCorrect={false}
        avail={!checkEmail(email)}
        availType={'exclamationcircle'}
      />
      <FormInput
        labelValue={address}
        onChangeText={(add) => setAddress(add)}
        placeholderText="Address"
        iconType="home"
        avail={!(address.length > 0)}
        availType={'exclamationcircle'}
      />
      <FormInput
        labelValue={phoneNumber}
        onChangeText={(phone) =>
          checkNum(phone) ? setPhoneNumber(phone) : null
        }
        placeholderText="Phone Number (09123456780)"
        iconType="phone"
        avail={!checkPhone(phoneNumber)}
        keyboardType="numeric"
        availType={'exclamationcircle'}
      />
      {!checkPass(password) ? (
        <Text style={{ fontSize: 8, color: 'red' }}>
          Should contain upper, lower, number, special and 8 and above
          characters
        </Text>
      ) : !checkConfAndPass(password, confirmPassword) ? (
        <Text style={{ fontSize: 8, color: 'red' }}>
          Password doesn't match
        </Text>
      ) : null}
      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
        avail={
          !(checkPass(password) && checkConfAndPass(password, confirmPassword))
        }
        availType={'exclamationcircle'}
      />
      {!checkConfAndPass(password, confirmPassword) ? (
        <Text style={{ fontSize: 8, color: 'red' }}>
          Password doesn't match
        </Text>
      ) : null}
      <FormInput
        labelValue={confirmPassword}
        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
        avail={
          !(checkPass(password) && checkConfAndPass(password, confirmPassword))
        }
        availType={'exclamationcircle'}
      />
      {message.length > 0 ? <Text style={style}>{message}</Text> : null}
      <FormButton buttonTitle="Sign Up" onPress={async () => await signup()} />
      <TouchableOpacity style={styles.forgotButton}>
        <Text
          style={styles.navButtonText}
          onPress={() => navigation.navigate('Login')}
        >
          Alreay have an account? Login Now!
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Registration

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d6faf4',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
  },
})
