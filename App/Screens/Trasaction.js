import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { SecondaryButton } from '../Components/Button'
import socket from '../../socket'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import axios from 'axios'
import { dataFire, storage } from '../../firebase/firebasecon'
const Transaction = ({ navigation, route }) => {
  const [data, setData] = useState({})
  const [bankorgcash, setBankOrGcash] = useState('gcash')
  const [bank, setBank] = useState({})
  const [gcash, setGcash] = useState({})
  const [sent, setSent] = useState({})
  const [image, setImage] = useState(false)
  useFocusEffect(
    React.useCallback(() => {
      setSent({})
      setImage(false)
      getData()
    }, [])
  )
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
    if (!result.cancelled) {
      await UploadReceipt(result)
    }
  }
  socket.emit('qrcodes')
  React.useEffect(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
    const resp = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/toPay?data=${JSON.stringify(
        encryptJSON({
          data: 'bank',
        })
      )}`
    )

    const resp2 = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/toPay?data=${JSON.stringify(
        encryptJSON({
          data: 'gcash',
        })
      )}`
    )

    resp2.data = decryptJSON(resp2.data.data)
    resp.data = decryptJSON(resp.data.data)
    setBank(resp.data.data)
    setGcash(resp2.data.data)

    socket.on('gcash', (data) => {
      setGcash(data)
    })
    socket.on('bank', (data) => {
      setBank(data)
    })
  }, [])
  const getData = async () => {
    setData(route.params?.data ?? {})
    if (route.params) {
      if (route.params.data.what === 'transaction') {
        socket.on(
          `currtransact/${await AsyncStorage.getItem('id')}/${decrypt(
            route.params.data.keyid
          )}`,
          (data) => {
            if (route.params.data.what === 'transaction') {
              setSent(data)
            }
          }
        )
      } else {
        socket.on(
          `currreserve/${await AsyncStorage.getItem('id')}/${decrypt(
            route.params.data.keyid
          )}`,
          (data) => {
            if (route.params.data.what === 'reservation') {
              setSent(data)
            }
          }
        )
      }
    }
  }
  const Cancel = async () => {
    await axios.patch(
      'https://eats-apionline.herokuapp.com/api/v1/cancelorder',
      encryptJSON({
        id: await AsyncStorage.getItem('id'),
        ref: data.what,
        reason: '',
        key: decrypt(data.keyid),
      })
    )
  }

  const UploadReceipt = async (image) => {
    setImage(true)
    const response = await fetch(image.uri)
    const buffer = await response.blob()
    let imagename =
      'receipt.' + image.uri.split('.')[image.uri.split('.').length - 1]
    let idn = decrypt(data.keyid)
    let ref = storage.ref(`receipt/${data.what}/${idn}`)
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
      .ref(`receipt`)
      .child(data.what)
      .child(idn)
      .child(imagename)
      .put(buffer)
    const url = await storage
      .ref(`receipt/${data.what}/${idn}`)
      .child(imagename)
      .getDownloadURL()

    await dataFire.ref(data.what).child(idn).update({ receipt: url })
    setImage(false)
  }
  React.useEffect(() => {
    if (Object.keys(sent).length > 0) {
      setData({
        keyid: route.params.data.keyid,
        what: route.params.data.what,
        ...sent,
      })
    }
  }, [sent])

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
            text={data.name + ' | ' + data.phone}
          />
          <IconAndText
            fontsize={12}
            style={{ flexDirection: 'row', paddingTop: 1 }}
            weight="normal"
            text={data.address}
          />

          <View style={{ flex: 1, backgroundColor: '#F0EEF6', marginTop: 10 }}>
            <CurveDiv>
              <IconAndText
                text="Order Information"
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
              <Item
                first="Order Id"
                style={{
                  flexDirection: 'row',
                  left: -8,
                }}
                widthleft="30%"
                widthright="70%"
                rightweight="normal"
                size={12}
                color="black"
                weight="bold"
                key={'c'}
                second={data.id}
              />
              <Item
                first="Order Status"
                style={{
                  flexDirection: 'row',
                  left: -8,
                }}
                widthleft="30%"
                widthright="70%"
                rightweight="normal"
                size={12}
                color="black"
                weight="bold"
                key={'c'}
                second={data.status}
              />
              <Item
                first="Payment Status"
                style={{
                  flexDirection: 'row',
                  left: -8,
                }}
                widthleft="30%"
                widthright="70%"
                rightweight="normal"
                size={12}
                color="black"
                weight="bold"
                key={'c'}
                second={data.pstatus}
              />
              <Item
                first="Order Date"
                style={{
                  flexDirection: 'row',
                  left: -8,
                }}
                widthleft="30%"
                widthright="70%"
                rightweight="normal"
                size={12}
                color="black"
                weight="bold"
                key={'c'}
                second={
                  new Date(data.dateBought).toDateString() +
                  ' ' +
                  new Date(data.dateBought).toLocaleTimeString()
                }
              />
              {data.dateDelivered ? (
                <Item
                  first="Delivery Date"
                  style={{
                    flexDirection: 'row',
                    left: -8,
                  }}
                  widthleft="30%"
                  widthright="70%"
                  rightweight="normal"
                  size={12}
                  color="black"
                  weight="bold"
                  key={'c'}
                  second={
                    new Date(data.dateDelivered).toDateString() +
                    ' ' +
                    new Date(data.dateDelivered).toLocaleTimeString()
                  }
                />
              ) : null}
              {data.datePaid ? (
                <Item
                  first="Payment Date"
                  style={{
                    flexDirection: 'row',
                    left: -8,
                  }}
                  widthleft="30%"
                  widthright="70%"
                  rightweight="normal"
                  size={12}
                  color="black"
                  weight="bold"
                  key={'c'}
                  second={
                    new Date(data.datePaid).toDateString() +
                    ' ' +
                    new Date(data.datePaid).toLocaleTimeString()
                  }
                />
              ) : null}
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
                text="Order Summary"
                image={require('../../assets/ordersummary.png')}
              />

              {data.items?.map((v, i) => (
                <View
                  style={{ flexDirection: 'row', paddingTop: 2, left: -12 }}
                  key={i}
                >
                  <View style={{ width: '15%' }}></View>
                  <View style={{ width: '85%', flexDirection: 'row' }}>
                    <Text
                      style={{ fontSize: 12, width: '60%', textAlign: 'left' }}
                    >
                      {v[1].amount}x {v[1].title}
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
                      {v[1].discount
                        ? (
                            (v[1].price - (v[1].discount * v[1].price) / 100) *
                            v[1].amount
                          ).toFixed(2)
                        : v[1].price.toFixed(2)}
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
                  marginVertical: 15,
                }}
              ></View>
              <Item
                first="Total Price"
                style={{
                  flexDirection: 'row',
                  left: -8,
                }}
                size={12}
                color="grey"
                key={'a'}
                second={'Php' + data.totalprice?.toFixed(2)}
              />
              <Item
                first="Delivery Free"
                key={'b'}
                style={{
                  flexDirection: 'row',
                  left: -8,
                }}
                size={12}
                color="grey"
                second={data.deliveryfee ? 'Php' + data.deliveryfee : 'Free'}
              />
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
                  'Php' + (data.totalprice + (data.deliveryfee ?? 0)).toFixed(2)
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
                text="Payment Details"
                style={{
                  flexDirection: 'row',
                  paddingTop: 11,
                  left: -8,
                }}
                image={require('../../assets/details.png')}
                weight="bold"
                fontsize={16}
              />

              <View
                style={{
                  flexDirection: 'row',
                  left: -12,
                }}
              >
                <View style={{ width: '15%' }}></View>
                <View style={{ width: '85%', flexDirection: 'row' }}>
                  <Picker
                    selectedValue={bankorgcash}
                    style={{ width: 120 }}
                    onValueChange={(itemValue, itemIndex) =>
                      setBankOrGcash(itemValue)
                    }
                  >
                    <Picker.Item
                      label="GCASH"
                      style={{
                        fontSize: 12,
                        backgroundColor: 'red',
                      }}
                      value="gcash"
                    />
                    <Picker.Item
                      style={{ fontSize: 12 }}
                      label="BANK"
                      value="bank"
                    />
                  </Picker>
                </View>
              </View>
              {bankorgcash === 'bank' ? (
                <IconAndText
                  fontsize={12}
                  style={{ flexDirection: 'row' }}
                  weight="bold"
                  text={bank.bank}
                />
              ) : null}
              <IconAndText
                fontsize={12}
                style={{ flexDirection: 'row', paddingTop: 3 }}
                weight="bold"
                text={bankorgcash === 'bank' ? bank.holder : gcash.holder}
              />
              <IconAndText
                fontsize={12}
                style={{
                  flexDirection: 'row',
                  paddingTop: 3,
                  marginBottom: 10,
                }}
                weight="bold"
                text={bankorgcash === 'bank' ? bank.number : gcash.number}
              />
              <View
                style={{
                  height: 180,
                  width: '100%',
                  paddingHorizontal: '25%',
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{
                    uri: bankorgcash === 'bank' ? bank.url : gcash.url,
                  }}
                  style={{ height: '100%', width: '100%' }}
                />
              </View>

              {/* <Item /> */}
            </CurveDiv>
            <CurveDiv>
              <IconAndText
                text="Upload Receipt"
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

              {data.receipt ? (
                <View
                  style={{
                    height: 180,
                    width: '100%',
                    paddingHorizontal: '25%',
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={{
                      uri: data.receipt,
                    }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </View>
              ) : null}
              {!image ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: 'yellow',
                    width: '70%',
                    marginHorizontal: '15%',
                    height: 40,
                    padding: 10,
                    marginBottom: 10,
                  }}
                  onPress={() => pickImage()}
                >
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: 16,
                      textAlign: 'center',
                    }}
                  >
                    Upload Receipt
                  </Text>
                </TouchableOpacity>
              ) : null}
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
                    data.status === 'Pending' || data.status === 'Processing'
                      ? 'red'
                      : 'grey',
                  borderRadius: 20,
                  padding: 8,
                }}
                onPress={async () =>
                  data.status === 'Pending' || data.status === 'Processing'
                    ? await Cancel()
                    : null
                }
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Cancel Order
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
export default Transaction

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
