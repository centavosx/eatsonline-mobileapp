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
  NumberInput,
  ScrollView,
  Image,
} from 'react-native'

import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import { dataFire, storage } from '../../firebase/firebasecon'
import { SecondaryButton } from '../Components/Button'
import * as ImagePicker from 'expo-image-picker'
import socket from '../../socket'
import sha256 from 'crypto-js/sha256'
const Profile = ({ navigation, setLogin, user }) => {
  const [index, setIndex] = useState(0)
  const [valueAdd, setValueAdd] = useState('')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [edit, setEdit] = useState(false)
  React.useEffect(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }, [])
  const resetAll = () => {
    setName('')
    setPhoneNumber('')
    setPassword('')
    setConfirm('')
  }
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
  const checkPhone = (v) => {
    let c = /^(09)\d+$/
    return v.toString().length > 10 ? c.test(v) : false
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
  const update = async (change, address, addressId, primary) => {
    await axios.patch(
      'https://eats-apionline.herokuapp.com/api/v1/address',
      encryptJSON({
        id: await AsyncStorage.getItem('id'),
        data: ['name', 'address', 'email', 'phoneNumber', 'addresses', 'guest'],
        address: address,
        primary: primary,
        change: change,
        addressId: addressId,
      })
    )
  }
  const deleteAddress = async (addressId) => {
    await axios.delete(
      `https://eats-apionline.herokuapp.com/api/v1/address?data=${JSON.stringify(
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
          addressId: addressId,
        })
      )}`
    )
  }

  const validatePass = () => {
    let re = /[A-Z]/
    let re2 = /[a-z]/
    let re3 = /[!@#$%^&*\(\)_+\}\{\":?><|~\.\-]/
    let re4 = /[0-9]/
    return !(
      !re.test(password) ||
      !re2.test(password) ||
      !re3.test(password) ||
      !re4.test(password) ||
      password.length < 8
    )
  }

  const checkP = () => {
    return password.length > 0 && validatePass()
      ? password === confirmPassword
      : false
  }

  const checkName = () => {
    return password.length > 0 && name.length > 0
      ? checkP() && !(name === user.name)
      : name.length > 0 && phoneNumber.length > 0
      ? checkNumber()
        ? !(name === user.name)
        : false
      : name.length > 0
      ? !(name === user.name)
      : false
  }
  const updateUserData = async () => {
    let updateData = {}
    if (name.length > 0 && name !== user.name) updateData.name = name
    if (password.length > 0) updateData.password = sha256(password).toString()
    if (phoneNumber.length > 0 && phoneNumber !== user.phoneNumber)
      updateData.phoneNumber = phoneNumber
    console.log(updateData)
    await axios.patch(
      'https://eats-apionline.herokuapp.com/api/v1/profileData',
      encryptJSON({
        id: await AsyncStorage.getItem('id'),
        updateData: updateData,
      })
    )
    setEdit(false)
  }
  const checkNumber = () => {
    let c = /^(09)\d+$/
    return password.length > 0 && phoneNumber.length > 0
      ? checkP() && !(phoneNumber === user.phoneNumber)
      : phoneNumber.length > 10
      ? c.test(phoneNumber) && !(phoneNumber === user.phoneNumber)
      : false
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
          <Tab selected={index === 0} key={0}>
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
                      backgroundColor: !edit ? '#abdcdc' : 'red',
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      if (!edit) resetAll()
                      setEdit(!edit)
                    }}
                  >
                    <Text style={{ color: !edit ? 'black' : 'white' }}>
                      {!edit ? 'Edit' : 'Cancel'}
                    </Text>
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
                {!edit ? (
                  <Text style={{ fontWeight: 'normal', marginLeft: 6 }}>
                    {user.name}
                  </Text>
                ) : (
                  <TextInput
                    placeholder={user.name}
                    style={{
                      fontWeight: 'normal',
                      marginLeft: 6,
                      borderWidth: 1,
                      marginTop: 5,
                      paddingHorizontal: 7,
                      borderColor: 'lightgrey',
                    }}
                    value={name}
                    onChangeText={(v) => setName(v)}
                  />
                )}
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
                {!edit ? (
                  <Text style={{ fontWeight: 'normal', marginLeft: 6 }}>
                    {user.phoneNumber}
                  </Text>
                ) : (
                  // ginawa ko pong number input para po number lang tatanggapin po
                  //wait
                  <TextInput
                    placeholder={user.phoneNumber}
                    style={{
                      fontWeight: 'normal',
                      marginTop: 5,
                      marginLeft: 6,
                      borderWidth: 1,
                      paddingHorizontal: 7,
                      borderColor: 'lightgrey',
                    }}
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={(v) =>
                      checkNum(v) ? setPhoneNumber(v) : null
                    }
                  />
                )}
              </View>
              {edit && !user.guest ? (
                <>
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
                      style={{
                        fontWeight: 'bold',
                        fontSize: 11,
                        marginRight: 6,
                      }}
                    >
                      Edit Password
                    </Text>

                    <TextInput
                      placeholder="Type new password"
                      style={{
                        fontWeight: 'normal',
                        marginLeft: 6,
                        borderWidth: 1,
                        marginTop: 5,
                        paddingHorizontal: 7,
                        borderColor: 'lightgrey',
                      }}
                      value={password}
                      onChangeText={(v) => setPassword(v)}
                    />
                  </View>
                </>
              ) : null}
              {edit && password.length > 0 ? (
                <>
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
                      style={{
                        fontWeight: 'bold',
                        fontSize: 11,
                        marginRight: 6,
                      }}
                    >
                      Confirm Password
                    </Text>

                    <TextInput
                      placeholder="Type confirm password"
                      style={{
                        fontWeight: 'normal',
                        marginLeft: 6,
                        borderWidth: 1,
                        marginTop: 5,
                        paddingHorizontal: 7,
                        borderColor: 'lightgrey',
                      }}
                      value={confirmPassword}
                      onChangeText={(v) => setConfirm(v)}
                    />
                  </View>
                </>
              ) : null}
              {edit ? (
                <>
                  <View
                    style={{
                      width: '200%',
                      height: 2,
                      backgroundColor: '#F0EEF6',
                      marginLeft: -100,
                      marginVertical: 5,
                    }}
                  ></View>
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}></Text>
                    <View style={{ position: 'absolute', right: 1 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            checkP() || checkName() || checkNumber()
                              ? 'green'
                              : 'grey',
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          if (checkP() || checkName() || checkNumber())
                            updateUserData()
                        }}
                      >
                        <Text style={{ color: !edit ? 'black' : 'white' }}>
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : null}
            </View>
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
                  Address
                </Text>
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
              <View style={{ width: '100%', marginTop: 20 }}>
                {user.addresses?.map((data, i) => (
                  <View
                    style={{
                      marginLeft: 5,
                      marginTop: 3,
                      color: 'black',
                      width: '100%',
                      flexDirection: 'row',
                    }}
                    key={i}
                  >
                    <Text style={{ width: '70%' }}>
                      {i + 1}. {data[1].address}
                    </Text>
                    <View style={{ width: '30%' }}>
                      {data[1].primary ? (
                        <Text
                          style={{
                            position: 'relative',
                            right: 1,
                            color: 'green',
                            textAlign: 'right',
                          }}
                        >
                          {data[1].primary ? '[DEFAULT]' : null}
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            update(false, data[1].address, data[0], true)
                          }
                        >
                          <Text
                            style={{
                              color: 'blue',
                              textAlign: 'right',
                            }}
                          >
                            Primary
                          </Text>
                        </TouchableOpacity>
                      )}
                      {data[1].primary ? null : (
                        <TouchableOpacity
                          onPress={() => deleteAddress(data[0])}
                        >
                          <Text
                            style={{
                              color: 'red',
                              textAlign: 'right',
                              marginTop: 5,
                            }}
                          >
                            Delete
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <SecondaryButton
              cart={false}
              styles={{
                backgroundColor: '#abdcdc',
                width: 150,
                marginLeft: 10,
              }}
              title="Logout"
              onPress={() => logout()}
            />
          </Tab>
          <Tab selected={index === 1} key={1}>
            <LoadTransact transaction={true} navigation={navigation} />
          </Tab>
          <Tab selected={index === 2} key={2}>
            <LoadTransact transaction={false} navigation={navigation} />
          </Tab>
        </ScrollView>
      </View>
    </View>
  )
}
const CardTransaction = (props) => (
  <>
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
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: 'black',

            fontWeight: 'bold',
          }}
        >
          Order ID: {props.id}
        </Text>
        <Text
          style={{
            position: 'absolute',
            right: 1,
            // left: 100,
            fontSize: 15,
            textAlign: 'right',
            color:
              props.status === 'Pending'
                ? '#406b00'
                : props.status === 'Processing'
                ? '#abdcdc'
                : props.status === 'Delivering'
                ? 'blue'
                : props.status === 'Completed'
                ? 'green'
                : 'red',
            fontWeight: 'bold',
          }}
        >
          {props.status}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: 'darkgray',

            fontWeight: 'bold',
          }}
        >
          More Details:
        </Text>
        <Text
          style={{
            color: 'blue',
            fontSize: 13,
            position: 'absolute',
            right: 1,
            textAlign: 'right',
            color: 'darkgray',
            textDecorationLine: 'underline',
          }}
          onPress={props.view} //google po muna nilagay ko po
        >
          View ►
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: 'darkgray',
            fontWeight: 'bold',
          }}
        >
          Order Item
        </Text>
        <Text
          style={{
            fontSize: 13,
            position: 'absolute',
            right: 1,
            textAlign: 'right',
            color: 'darkgray',
          }}
        >
          {props.item}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: 'darkgray',

            fontWeight: 'bold',
          }}
        >
          Order Date
        </Text>
        <Text
          style={{
            fontSize: 13,

            textAlign: 'right',
            color: 'darkgray',
            position: 'absolute',
            right: 1,
          }}
        >
          {props.date}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 12,
        }}
      >
        {/* pati po dito sa button po na ito */}
        {props.status === 'Pending' || props.status === 'Processing' ? (
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              paddingHorizontal: 15,
              paddingVertical: 6,
              borderRadius: 10,
              fontSize: 12,
            }}
            onPress={
              props.status === 'Pending' || props.status === 'Processing'
                ? props.cancel
                : null
            }
          >
            <Text style={{ color: 'white' }}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 17,
            }}
          ></View>
        )}
        <Text
          style={{
            marginTop: 3,
            fontSize: 16,
            fontWeight: 'bold',
            color: 'black',
            position: 'absolute',
            right: 1,
            textAlign: 'right',
          }}
        >
          Order Total: ₱{props.total.toFixed(2)}
        </Text>
      </View>
    </View>
  </>
)

const LoadTransact = (props) => {
  const [data, setData] = useState([])
  const [reverse, setReverse] = useState(false)
  React.useEffect(async () => {
    const response = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/getTransactions?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
          transaction: props.transaction ? 'transaction' : 'reservation',
        })
      )}`
    )
    response.data = decryptJSON(response.data.data)
    setData(response.data.data)
    socket.on(
      `${props.transaction ? 'transaction-all' : 'reservation-all'}/${decrypt(
        await AsyncStorage.getItem('id')
      )}`,
      (data) => {
        if (reverse) {
          data.reverse()
        }
        setData(data)
      }
    )
  }, [])
  const Cancel = async (id) => {
    await axios.patch(
      'https://eats-apionline.herokuapp.com/api/v1/cancelorder',
      encryptJSON({
        id: await AsyncStorage.getItem('id'),
        ref: props.transaction ? 'transaction' : 'reservation',
        reason: '',
        key: id,
      })
    )
  }
  const sort = () => {
    const v = data
    v.reverse()
    setData(v)
    setReverse(!reverse)
  }
  return (
    <ScrollView>
      <View style={{ flexDirection: 'row', marginBottom: 18 }}>
        <Text
          style={{
            fontSize: 15,
            color: 'black',
            width: '100%',
            fontWeight: 'bold',
          }}
        >
          Order History
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'darkgray',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            fontSize: 15,
            color: 'black',
            // width: '50%',
            fontWeight: 'bold',
            textAlign: 'right',

            position: 'absolute',
            right: 1,
          }}
          onPress={() => sort()}
        >
          <Text>{!reverse ? 'Newest to Oldest' : 'Oldest To Newest'}</Text>
        </TouchableOpacity>
      </View>
      {data.map((d, i) => (
        <CardTransaction
          key={i}
          id={d[1].id}
          item={d[1].items.length}
          status={d[1].status}
          total={d[1].totalprice}
          date={
            new Date(d[1].dateBought).toDateString() +
            ' ' +
            new Date(d[1].dateBought).toLocaleTimeString()
          }
          view={() =>
            props.navigation.navigate('Transaction', {
              data: {
                keyid: d[0],
                what: props.transaction ? 'transaction' : 'reservation',
                ...d[1],
              },
            })
          }
          cancel={() => Cancel(d[0])}
        />
      ))}
    </ScrollView>
  )
}

const Tab = (props) => <>{props.selected ? props.children : null}</>

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
    marginBottom: 12,
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
