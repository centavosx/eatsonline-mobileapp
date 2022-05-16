import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
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
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import { dataFire, storage } from '../../firebase/firebasecon'
import { PrimaryButton, SecondaryButton } from '../Components/Button'
import FormInput from '../Components/FormInput'
import * as ImagePicker from 'expo-image-picker'
const Profile = ({ navigation, setLogin, user }) => {
  const [index, setIndex] = useState(0)
  const [valueAdd, setValueAdd] = useState('')
  const [loading, setLoading] = useState(false)
  React.useEffect(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }, [])
  const logout = async () => {
    await AsyncStorage.removeItem('id')
    setLogin(false)
  }
  const add = async () => {
    if (valueAdd.length > 0) {
      await axios.post(
        'https://eats-apionline.herokuapp.com/api/v1/address',
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
          data: [
            'name',
            'address',
            'email',
            'phoneNumber',
            'addresses',
            'guest',
          ],
          address: valueAdd,
        })
      )
      setValueAdd('')
    }
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
    if (!result.cancelled) {
      await updateProfilePic(result)
    }
  }
  const updateProfilePic = async (image) => {
    try {
      setLoading(true)
      const response = await fetch(image.uri)
      const buffer = await response.blob()
      let imagename =
        'profilepicture.' +
        image.uri.split('.')[image.uri.split('.').length - 1]
      const idn = decrypt(await AsyncStorage.getItem('id'))
      let ref = storage.ref(`accounts/${idn}/image`)
      try {
        let dir = await ref.listAll()
        dir.items.forEach(async (fileRef) => {
          var dirRef = storage.ref(fileRef.fullPath)
          let url = await dirRef.getDownloadURL()
          let imgRef = storage.refFromURL(url)
          await imgRef.delete()
        })
      } catch {}
      await storage
        .ref(`accounts`)
        .child(idn)
        .child('image')
        .child(imagename)
        .put(buffer)
      const url = await storage
        .ref(`accounts/${idn}/image`)
        .child(imagename)
        .getDownloadURL()
      await dataFire.ref('accounts').child(idn).update({ img: url })
      setLoading(false)
    } catch {
      setLoading(false)
    }
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
          {!loading ? (
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                style={styles.userImg}
                source={
                  !user.img ? require('../../assets/j2.jpg') : { uri: user.img }
                }
              />
            </TouchableOpacity>
          ) : null}
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
            <Text style={{ textAlign: 'center' }}>Purchases</Text>
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
          {index === 0 ? (
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
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Profile
                </Text>
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
          ) : index === 1 ? (
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
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Order History
                </Text>
              </View>
            </View> /*dito*/
          ) : index === 2 ? (
            <View></View>
          ) : null}
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
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Address</Text>
            </View>
            <View style={{ width: '100%' }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  width: '100%',
                }}
              >
                <TextInput
                  value={valueAdd}
                  placeholder="Type Address"
                  onChangeText={(v) => setValueAdd(v)}
                />
              </View>

              <View style={{ position: 'absolute', right: 8, top: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#abdcdc',
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 10,
                  }}
                  onPress={() => add()}
                >
                  <Text>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ width: '100%', marginTop: 25 }}>
              {user.addresses?.map((data, i) => (
                <Text style={{ marginLeft: 5, color: 'black' }} key={i}>
                  {i + 1}. {data[1].address}{' '}
                  <Text style={{ color: 'red' }}>
                    {data[1].primary ? '[DEFAULT]' : null}
                  </Text>
                </Text>
              ))}
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
