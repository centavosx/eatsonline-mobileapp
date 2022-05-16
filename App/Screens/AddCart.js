import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  Image,
  ListFooterComponent,
  ListFooterComponentStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import food from '../Components/Food'
import { PrimaryButton } from '../Components/Button'
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AddCart = ({ navigation, header }) => {
  const [deleteC, setItemsToDelete] = useState([])
  const [cart, setCart] = useState([])
  const [dataAmt, setdataAmt] = useState({})
  const [select, setSelect] = useState({})
  const [totalamount, setTotalAmount] = useState(0)
  const [state, setState] = useState(false)
  useFocusEffect(
    React.useCallback(() => {
      header('Cart')
      getCart()
    }, [])
  )
  const getCart = async () => {
    AsyncStorage
    const resp = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/cart?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
        })
      )}`
    )

    resp.data = decryptJSON(resp.data.data)
    if (!resp.data.error) {
      if (resp.data.success) {
        let obj = {}
        for (let x of resp.data.data) {
          obj[x[0]] = x[1].amount
        }
        setdataAmt(obj)
        setCart(resp.data.data)
      }
    }
  }
  const deleteReq = async (keys) => {
    let resp = await axios.delete(
      `https://eats-apionline.herokuapp.com/api/v1/cart?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
          keys,
        })
      )}`
    )
    const val = decryptJSON(resp.data.data)
    if (val.success) return val.data
    else return []
  }
  const deleteItem = async (id) => {
    let data = await deleteReq(id)
    let obj = {}
    for (let x of data) {
      obj[x[0]] = x[1].amount
    }
    setSelect({})
    setTotalAmount(0)
    setdataAmt(obj)
    setCart(data)
  }

  const update = (key2, amt) => {
    if (amt < 1) {
      dataAmt[key2] = 1
    } else if (amt > 100) {
      dataAmt[key2] = 100
    } else {
      dataAmt[key2] = parseInt(amt)
    }
    if (amt >= 1 && amt <= 100) {
      let totalvalue = 0
      let f = {}
      let obj = {}
      let deleteItems = []
      for (let x of cart) {
        x[1].amount = dataAmt[x[0]]
        if (x[0] in select) {
          deleteItems.push(x[0])
          totalvalue +=
            'discount' in x[1]
              ? (x[1].price - (x[1].discount * x[1].price) / 100) *
                dataAmt[x[0]]
              : x[1].price * dataAmt[x[0]]
          f[x[0]] = x[1]
        }
        obj[x[0]] = dataAmt[x[0]]
      }
      setSelect(f)
      setdataAmt(obj)
      setTotalAmount(totalvalue)
      setItemsToDelete(deleteItems)
      const timer = setTimeout(async () => {
        sendreq()
      }, 1300)
      return () => clearTimeout(timer)
    }
  }
  const sendreq = async () => {
    setState(true)
    const timer = setTimeout(async () => {
      if (state) {
        let obj = {}
        for (let x of cart) {
          obj[x[0]] = {}
          obj[x[0]].amount = dataAmt[x[0]]
          obj[x[0]].date = x[1].date
          obj[x[0]].key = x[1].key
        }
        await axios.patch(
          'https://eats-apionline.herokuapp.com/api/v1/cart',
          encryptJSON({
            id: await AsyncStorage.getItem('id'),
            data: obj,
          })
        )
      }
    }, 1300)
    return () => clearTimeout(timer)
  }
  const check = (id, data) => {
    if (!(id in select)) {
      select[id] = data
      setTotalAmount(
        totalamount +
          ('discount' in data
            ? data.price - (data.discount * data.price) / 100
            : data.price * data.amount)
      )
    } else {
      delete select[id]
      setTotalAmount(
        totalamount -
          ('discount' in data
            ? data.price - (data.discount * data.price) / 100
            : data.price * data.amount)
      )
    }
    let totalvalue = 0
    let count = 0
    let deleteItems = []
    for (let x of cart) {
      if (x[0] in select) {
        deleteItems.push(x[0])
        totalvalue +=
          'discount' in x[1]
            ? (x[1].price - (x[1].discount * x[1].price) / 100) * dataAmt[x[0]]
            : x[1].price * dataAmt[x[0]]
        count++
      }
    }

    setItemsToDelete(deleteItems)
    setSelect(select)
    setTotalAmount(totalvalue)
  }

  const CartCard = ({ item, id }) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.cartCard,
          backgroundColor: id in select ? 'rgb(252, 255, 185)' : 'white',
          opacity: id in select ? 1 : 1,
        }}
        opacity={1}
        onPress={() => check(id, item)}
      >
        <Image
          style={{
            height: 80,
            width: 80,
            borderRadius: 10,
            marginTop: 15,
            marginLeft: 10,
          }}
          source={{ uri: item.link }}
        />
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              height: 100,
              marginLeft: 10,
              paddingVertical: 20,
              flex: 1,
              width: '45%',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 13, color: 'black' }}>{item.type}</Text>
            <Text style={{ fontSize: 13, color: 'black' }}>{item.seller}</Text>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
              ₱{item.price}
            </Text>
          </View>
          <View
            style={{
              fontWeight: 'bold',
              color: 'black',
              flexDirection: 'row',
              width: '55%',
              height: 25,
              marginTop: 20,
              marginRight: 10,
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                backgroundColor: '#d6faf4',
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
              onPress={() => update(id, dataAmt[id] - 1)}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
            </TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 10,
                paddingTop: 2,
                backgroundColor: '#abdcdc',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {dataAmt[id]}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                backgroundColor: '#d6faf4',

                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
              onPress={() => update(id, dataAmt[id] + 1)}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#d6faf4',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <ScrollView
          style={{ flex: 1, paddingVertical: 15, marginBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
            data={cart}
            renderItem={({ item }) => <CartCard item={item[1]} id={item[0]} />}
            ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
            ListFooterComponent={() => (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 15,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    Total Price
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    ₱{totalamount.toFixed(2)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ marginHorizontal: 30 }}>
                    <PrimaryButton
                      title="DELETE"
                      fontstyles={{ fontSize: 14, color: 'white' }}
                      styles={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        backgroundColor: 'red',
                      }}
                      onPress={async () =>
                        deleteC.length > 0 ? await deleteItem(deleteC) : null
                      }
                    />
                  </View>
                  <View style={{ marginHorizontal: 30 }}>
                    <PrimaryButton
                      title="CHECKOUT"
                      fontstyles={{ fontSize: 14 }}
                      styles={{ paddingVertical: 10, paddingHorizontal: 15 }}
                      onPress={() =>
                        navigation.navigate('Checkout', { data: {} })
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </View>
  )
}
export default AddCart

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  cartCard: {
    elevation: 3,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingBottom: 18,
    marginVertical: 3,
    marginHorizontal: 10,
    paddingHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 80,
    height: 30,
    backgroundColor: '#eaec31',
    borderRadius: 30,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  details: {
    backgroundColor: '#d6faf4',
    height: '100%',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
})
