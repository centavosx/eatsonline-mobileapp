import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { PrimaryButton, SecondaryButton } from '../Components/Button'

const Profile = ({ navigation, setLogin, user }) => {
  const [index, setIndex] = useState(0)

  const logout = async () => {
    await AsyncStorage.removeItem('id')
    setLogin(false)
  }
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#d6faf4',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingHorizontal: 10,
        }}
      >
        <View style={styles.header}>
          <Icon
            name="shopping-cart"
            style={styles.cart}
            onPress={() => navigation.navigate('AddCart')}
          />
          <Icon
            name="forum"
            style={styles.message}
            onPress={() => navigation.navigate('SupportChat')}
          />
        </View>
        <View style={{ ...styles.card, backgroundColor: '#d6faf4' }}>
          <Image
            style={styles.userImg}
            source={
              !user.img ? require('../../assets/j2.jpg') : { uri: user.img }
            }
          />
        </View>
        <View
          style={{
            ...styles.card,
            height: 42,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'baseline',
            paddingTop: 0,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'lightgrey',
          }}
        >
          <TouchableOpacity
            style={{
              width: '32.35%',
              backgroundColor: index === 0 ? '#abdcdc' : 'white',
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              height: 40,
              alignItems: 'center',
              paddingTop: 10,
            }}
            onPress={() => setIndex(0)}
          >
            <Text style={{ textAlign: 'center' }}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '31.35%',
              backgroundColor: index === 1 ? '#abdcdc' : 'white',
              height: 40,
              alignItems: 'center',
              paddingTop: 10,
            }}
            onPress={() => setIndex(1)}
          >
            <Text style={{ textAlign: 'center' }}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '36.35%',
              backgroundColor: index === 2 ? '#abdcdc' : 'white',
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              height: 40,
              alignItems: 'center',
              paddingTop: 10,
            }}
            onPress={() => setIndex(2)}
          >
            <Text style={{ textAlign: 'center' }}>Advance Orders</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              ...styles.card,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'lightgrey',
              alignItems: 'baseline',
              paddingTop: 15,
              padding: 15,
            }}
          >
            <View style={{ width: '100%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Profile</Text>
              <View style={{ position: 'absolute', right: 1 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#abdcdc',
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 10,
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                marginTop: 8,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 11, marginRight: 6 }}
              >
                Name:
              </Text>
              <Text style={{ fontWeight: 'normal', marginLeft: 6 }}>
                {user.name}
              </Text>
            </View>
            <View
              style={{
                width: '200%',
                height: 2,
                backgroundColor: '#F0EEF6',
                marginLeft: -100,
                marginVertical: 5,
              }}
            ></View>
            <View
              style={{
                width: '100%',
                paddingTop: 5,
                paddingBottom: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 11, marginRight: 6 }}
              >
                Email:
              </Text>
              <Text style={{ fontWeight: 'normal', marginLeft: 6 }}>
                {user.email}
              </Text>
            </View>
            <View
              style={{
                width: '200%',
                height: 2,
                backgroundColor: '#F0EEF6',
                marginLeft: -100,
                marginVertical: 5,
              }}
            ></View>
            <View
              style={{
                width: '100%',
                paddingTop: 5,
                paddingBottom: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{ fontWeight: 'bold', fontSize: 11, marginRight: 6 }}
              >
                Phone Number:
              </Text>
              <Text style={{ fontWeight: 'normal', marginLeft: 6 }}>
                {user.phoneNumber}
              </Text>
            </View>
          </View>

          <SecondaryButton
            cart={false}
            styles={{ backgroundColor: '#abdcdc', width: 150, marginLeft: 10 }}
            title="Logout"
            onPress={() => logout()}
          />
        </ScrollView>
      </View>
    </View>
  )
}
export default Profile
const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
    backgroundColor: '#d6faf4',
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },
  header: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  cart: {
    fontSize: 28,
    position: 'absolute',
    right: 1,
  },
  message: {
    fontSize: 28,
    marginLeft: 10,
  },
  user: {
    marginTop: -10,
    marginLeft: 15,
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2aece3',
  },
  InputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#2aece3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginLeft: 50,
  },
  Login: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  Signup: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortBtn: {
    width: 100,
    height: 40,
    marginLeft: 10,
    backgroundColor: '#eaec31',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  userImg: {
    height: 100,
    width: 100,
    borderRadius: 75,
    borderWidth: 3,

    shadowColor: 'black',
    borderColor: 'white',
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
    color: '#000000',
  },
  aboutUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    color: '#000000',
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(234,236,49, .8)',
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    paddingBottom: 8,
    paddingTop: 8,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 8,
    color: 'black',
    textAlign: 'center',
  },
  result: {
    fontSize: 12,
    textAlign: 'justify',
    marginBottom: 10,
    color: 'black',
    marginLeft: '10%',
    marginRight: '10%',
  },
})
