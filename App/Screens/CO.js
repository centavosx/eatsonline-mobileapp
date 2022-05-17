import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { SecondaryButton } from '../Components/Button'
import socket from '../../socket'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import axios from 'axios'
const Checkout = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([])
  const [selectedAdd, setSelectedAdd] = useState('')
  const [order, setOrder] = useState(false)
  const [cod, setCOD] = useState(false)
  const [dates, setDates] = useState({})
  const [message, setMessage] = useState('')
  const data = route.params
  React.useEffect(async () => {
    const response = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/profileData?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
          data: ['addresses'],
        })
      )}`
    )
    response.data = decryptJSON(response.data.data)
    let arr = []
    if (response.data.addresses === undefined) {
      response.data.addresses = []
    } else {
      for (let x of response.data.addresses) {
        if (x[1].primary) setSelectedAdd(x[1].address)

        arr.push(x[1].address)
      }
    }
    setAddresses(arr)

    socket.emit('userinfo', await AsyncStorage.getItem('id'))
    socket.on(
      `usercartadd/${decrypt(await AsyncStorage.getItem('id'))}`,
      (data) => {
        let newarr = []
        for (let x of data.addresses) {
          newarr.push(x[1].address)
        }
        setAddresses(newarr)
      }
    )
  }, [])

  const addAdvDates = (id, val) => {
    const obj = { ...dates }
    obj[id] = val
    console.log(obj)
    setDates(obj)
  }
  const checkToContinue = async () => {
    if (order) return true
    let obj = {}
    for (let x of data.items) {
      obj[decrypt(x.key)] = x.amount
    }
    const resp = await axios.put(
      'https://eats-apionline.herokuapp.com/api/v1/checkCartItems',
      encryptJSON(obj)
    )
    setMessage(!resp.data.data)
    return resp.data.data
  }
  const orderNow = async () => {
    if (checkToContinue()) {
      const obj = {
        name: data.name,
        address: selectedAdd,
        phone: data.phone,
        items: Object.keys(data.items).map((d) => {
          const ob = { ...data.items[d] }
          delete ob['adv']
          delete ob['comments']
          ob.date = dates[d]
          return [d, ob]
        }),
        payment: cod ? 'C.O.D' : 'Online Payment',
        totalprice: data.total,
        userid: await AsyncStorage.getItem('id'),
        message: message,
      }

      const resp = await axios.post(
        'https://eats-apionline.herokuapp.com/api/v1/transact',
        encryptJSON({
          data: obj,
          advance: order,
        })
      )

      resp.data = decryptJSON(resp.data.data)

      if (!resp.data.error) {
        if (resp.data.completed) {
          navigation.navigate('Transaction', {
            data: {
              keyid: resp.data.data.iditem,
              what: resp.data.data.what,
              ...resp.data.data,
            },
          })
          navigation.goBack()
        } else {
          alert(resp.data.message.map((data) => data + '\n'))
        }
      }
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#d6faf4', flex: 1 }}>
      <View style={styles.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Transaction</Text>
      </View>
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            paddingTop: 10,
            borderRadius: 40,
          }}
        >
          <IconAndText
            fontsize={16}
            style={{ flexDirection: 'row', paddingTop: 11 }}
            weight="bold"
            text="Delivery Address"
            image={require('../../assets/icons8-location-50.png')}
          />
          <IconAndText
            fontsize={12}
            style={{ flexDirection: 'row', paddingTop: 7 }}
            weight="normal"
            text={
              data.name?.substr(0, 15) +
              '' +
              (data.name ? (data.name.length > 15 ? '...' : '') : '') +
              ' | ' +
              data.phone
            }
          />
          <View style={{ flexDirection: 'row', paddingTop: 7 }}>
            <View style={{ width: '7%', marginLeft: 22 }}></View>
            <View style={{ width: '93%', paddingRight: 40 }}>
              {addresses.length > 0 ? (
                <Picker
                  selectedValue={selectedAdd}
                  style={{
                    width: '100%',
                    borderWidth: 1,
                    borderColor: 'black',
                    marginTop: -10,
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedAdd(itemValue)
                  }
                >
                  {addresses.map((data, indx) => (
                    <Picker.Item
                      key={indx}
                      label={data}
                      style={{
                        fontSize: 12,
                        backgroundColor: 'red',
                      }}
                      value={data}
                    />
                  ))}
                </Picker>
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Text
                    style={{ color: 'blue', textDecorationLine: 'underline' }}
                  >
                    Add an Address
                  </Text>
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    Add address to continue
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* 
          <IconAndText
            fontsize={12}
            style={{ flexDirection: 'row', paddingTop: 1 }}
            weight="normal"
            text={'875 labanos street'}
          /> */}

          <View style={{ flex: 1, backgroundColor: '#F0EEF6', marginTop: 10 }}>
            <CurveDiv>
              <IconAndText
                fontsize={16}
                style={{
                  flexDirection: 'row',
                  paddingTop: 11,
                  left: -8,
                  marginBottom: 11,
                }}
                weight="bold"
                text="Order Summary"
                image={require('../../assets/ordersummary.png')}
              />

              {Object.keys(data.items).map((v, i) => (
                <View
                  style={{ flexDirection: 'row', paddingTop: 2, left: -12 }}
                  key={i}
                >
                  <View style={{ width: '15%' }}></View>
                  <View style={{ width: '85%', flexDirection: 'row' }}>
                    <Text
                      style={{ fontSize: 12, width: '60%', textAlign: 'left' }}
                    >
                      {data.items[v].amount}x {data.items[v].title}
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        width: '40%',
                        textAlign: 'right',
                        paddingRight: 25,
                      }}
                    >
                      Php
                      {data.items[v].discount
                        ? (
                            (data.items[v].price -
                              (data.items[v].discount * data.items[v].price) /
                                100) *
                            data.items[v].amount
                          ).toFixed(2)
                        : data.items[v].price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
              <View
                style={{
                  width: '90%',
                  height: 2,
                  backgroundColor: '#F0EEF6',
                  marginHorizontal: '5%',
                  marginVertical: 12,
                }}
              ></View>

              <Item
                first="Order Total"
                key={2}
                style={{
                  flexDirection: 'row',
                  left: -8,
                }}
                color="black"
                weight="bold"
                size={14}
                second={
                  'Php' + (data.total + (data.deliveryfee ?? 0)).toFixed(2)
                }
              />
            </CurveDiv>

            {data.message ? (
              <CurveDiv>
                <IconAndText
                  text="Message"
                  style={{
                    flexDirection: 'row',
                    paddingTop: 11,
                    left: -8,
                    marginBottom: 11,
                  }}
                  weight="bold"
                  fontsize={16}
                  image={require('../../assets/message.png')}
                />
                <IconAndText
                  fontsize={12}
                  style={{ flexDirection: 'row', paddingTop: 1 }}
                  weight="normal"
                  text={data.message}
                />
              </CurveDiv>
            ) : null}

            <CurveDiv>
              <IconAndText
                text="Order Method"
                style={{
                  flexDirection: 'row',
                  paddingTop: 11,
                  left: -8,
                  marginBottom: 11,
                }}
                weight="bold"
                fontsize={16}
                image={require('../../assets/shipping.png')}
              />
              <View style={{ flexDirection: 'row', left: -8 }}>
                <View style={{ width: '15%' }}></View>
                <View style={{ width: '85%', flexDirection: 'row' }}>
                  <RadioButton
                    color="yellow"
                    width={15}
                    height={15}
                    selected={order === false}
                    onClick={() => setOrder(false)}
                  />
                  <Text style={{ top: -4, marginLeft: 10 }}>Order now</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', left: -8, marginTop: 3 }}>
                <View style={{ width: '15%' }}></View>
                <View style={{ width: '85%', flexDirection: 'row' }}>
                  <RadioButton
                    color="yellow"
                    width={15}
                    height={15}
                    selected={order === true}
                    onClick={() => setOrder(true)}
                  />
                  <Text style={{ top: -4, marginLeft: 10 }}>Advance Order</Text>
                </View>
              </View>
            </CurveDiv>
            {order ? (
              <CurveDiv>
                <IconAndText
                  text="Advance Orders"
                  style={{
                    flexDirection: 'row',
                    paddingTop: 11,
                    left: -8,
                  }}
                  image={require('../../assets/advance.png')}
                  weight="bold"
                  fontsize={16}
                />
                <ScrollView style={{ left: -12 }}>
                  {Object.keys(data.items).map((v, i) => (
                    <View
                      style={{
                        flexDirection: 'row',
                      }}
                    >
                      <View style={{ width: '15%' }}></View>
                      <View style={{ width: '85%' }}>
                        <Text>{data.items[v].title}</Text>
                        <Picker
                          selectedValue={dates[v]}
                          style={{
                            width: '100%',
                            borderWidth: 1,
                            borderColor: 'black',
                            marginTop: -10,
                          }}
                          onValueChange={(itemValue, itemIndex) =>
                            addAdvDates(v, itemValue)
                          }
                        >
                          <Picker.Item
                            label="Select Date"
                            style={{
                              fontSize: 12,
                              backgroundColor: 'red',
                            }}
                            value={undefined}
                          />
                          {data.items[v].adv
                            ? data.items[v].adv.map((v, i) => (
                                <Picker.Item
                                  key={i}
                                  style={{ fontSize: 12 }}
                                  label={new Date(v).toDateString()}
                                  value={v}
                                />
                              ))
                            : null}
                        </Picker>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                {/* <Item /> */}
              </CurveDiv>
            ) : null}
            <CurveDiv>
              <IconAndText
                text="Payment Method"
                style={{
                  flexDirection: 'row',
                  paddingTop: 11,
                  left: -8,
                  marginBottom: 11,
                }}
                weight="bold"
                fontsize={16}
                image={require('../../assets/receipt.png')}
              />

              <View style={{ flexDirection: 'row', left: -8, marginTop: 3 }}>
                <View style={{ width: '15%' }}></View>
                <View style={{ width: '85%', flexDirection: 'row' }}>
                  <RadioButton
                    color="yellow"
                    width={15}
                    height={15}
                    selected={cod === false}
                    onClick={() => setCOD(false)}
                  />
                  <Text style={{ top: -4, marginLeft: 10 }}>
                    Online Payment
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', left: -8 }}>
                <View style={{ width: '15%' }}></View>
                <View style={{ width: '85%', flexDirection: 'row' }}>
                  <RadioButton
                    color="yellow"
                    width={15}
                    height={15}
                    selected={cod}
                    onClick={() => setCOD(true)}
                  />
                  <Text style={{ top: -4, marginLeft: 10 }}>
                    Cash on delivery
                  </Text>
                </View>
              </View>
            </CurveDiv>
            <CurveDiv>
              <IconAndText
                fontsize={16}
                style={{
                  flexDirection: 'row',
                  paddingTop: 11,
                  left: -8,
                  marginBottom: 11,
                }}
                weight="bold"
                text="Note"
                image={require('../../assets/message.png')}
              />
              <View
                style={{ flexDirection: 'row', left: -7, marginBottom: 10 }}
              >
                <View style={{ width: '15%' }}></View>
                <View style={{ width: '85%', paddingRight: 13 }}>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: 'grey',
                      padding: 10,
                      height: 80,
                      textAlignVertical: 'top',
                      borderRadius: 10,
                    }}
                    value={message}
                    placeholder="Type to add note"
                    multiline={true}
                    onChangeText={(v) => setMessage(v)}
                  />
                </View>
              </View>
            </CurveDiv>
            <View
              style={{
                height: 100,
                backgroundColor: 'white',
                borderTopEndRadius: 40,
                borderTopStartRadius: 40,
                padding: 27,
                paddingBottom: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor:
                    selectedAdd.length > 0
                      ? order
                        ? Object.keys(dates).length ===
                          Object.keys(data.items).length
                          ? 'yellow'
                          : 'grey'
                        : 'yellow'
                      : 'grey',

                  borderRadius: 20,
                  padding: 8,
                }}
                onPress={async () =>
                  selectedAdd.length > 0
                    ? order
                      ? Object.keys(dates).length ===
                        Object.keys(data.items).length
                        ? orderNow()
                        : null
                      : orderNow()
                    : null
                }
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 28,
                    fontWeight: 'bold',
                    color:
                      selectedAdd.length > 0
                        ? order
                          ? Object.keys(dates).length ===
                            Object.keys(data.items).length
                            ? 'black'
                            : 'white'
                          : 'black'
                        : 'white',
                  }}
                >
                  CHECKOUT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const Item = (props) => (
  <View style={props.style}>
    <View style={{ width: '15%' }}></View>
    <View style={{ width: '85%', flexDirection: 'row' }}>
      <Text
        style={{
          fontSize: props.leftsize ?? props.size,
          fontWeight: props.leftweight ?? props.weight,
          width: props.widthleft ?? '60%',
          textAlign: 'left',
          color: props.color,
        }}
      >
        {props.first.substring(0, 20)}
      </Text>

      <Text
        style={{
          fontSize: props.rightsize ?? props.size,
          fontWeight: props.rightweight ?? props.weight,
          width: props.widthright ?? '40%',
          textAlign: 'right',
          paddingRight: 25,
          color: props.color,
        }}
      >
        {props.second}
      </Text>
    </View>
  </View>
)

const IconAndText = (props) => (
  <View style={props.style}>
    <View style={{ width: '7%', marginLeft: 22 }}>
      {props.image ? (
        <Image source={props.image} style={{ width: '70%' }} />
      ) : null}
    </View>
    <View>
      <Text style={{ fontSize: props.fontsize, fontWeight: props.weight }}>
        {props.text}
      </Text>
    </View>
  </View>
)

const CurveDiv = (props) => (
  <View
    style={{
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      paddingBottom: 10,
    }}
  >
    {props.children}
  </View>
)

const RadioButton = ({ width, height, color, selected, onClick }) => {
  return (
    <TouchableOpacity
      style={{
        width: width,
        height: height,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
        padding: 1,
      }}
      onPress={onClick}
    >
      <View
        style={{
          backgroundColor: selected ? color : 'transparent',
          flex: 1,
          borderRadius: 40,
        }}
      ></View>
    </TouchableOpacity>
  )
}
export default Checkout

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: '#eaec31',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  IconContainer: {
    backgroundColor: 'white',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  detailText: {
    marginTop: 10,
    lineHeight: 30,
    fontSize: 15,
    color: 'black',
  },
  price: {
    fontWeight: 'bold',
    marginTop: 10,
    lineHeight: 30,
    fontSize: 18,
    color: 'black',
  },
})
