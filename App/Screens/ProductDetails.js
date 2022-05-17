import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { addCart, createStars } from './Featured'
import { SecondaryButton } from '../Components/Button'
import axios from 'axios'
import socket from '../../socket'
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import AsyncStorage from '@react-native-async-storage/async-storage'

const createClickableStars = (n, s, mT, mH, func) => {
  let v = []
  for (let x = 1; x <= 5; x++) {
    if (x <= n) {
      v.push(
        <TouchableOpacity onPress={() => func(x)}>
          <Entypo name="star" key={x} size={!s ? 10 : s} color="#e1ad01" />
        </TouchableOpacity>
      )
    } else {
      v.push(
        <TouchableOpacity onPress={() => func(x)}>
          <Entypo name="star" key={x} size={!s ? 10 : s} color="grey" />
        </TouchableOpacity>
      )
    }
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: !mT ? -25 : mT,
        marginHorizontal: !mH ? 20 : mH,
      }}
    >
      {v.map((d) => d)}
    </View>
  )
}
const Comments = (props) => {
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState('')
  const [rate, setRate] = useState(0)
  React.useEffect(() => {
    if ((props.id?.length > 0 ?? false) && props.id) {
      getComments()
      socket.emit('comments', props.id.split(' ').join('+'))
      socket.on(`productcomment/${props.id.split(' ').join('+')}`, (data) => {
        data.reverse()
        setComments(data)
      })
    }
  }, [props.id])

  const getComments = async () => {
    const response = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/comment?data=${JSON.stringify(
        encryptJSON({
          id: props.id,
        })
      )}`
    )

    response.data = decryptJSON(response.data.data)
    if (!response.data.error) {
      response.data.data.reverse()
      setComments(response.data.data)
    }
  }
  const sendComment = async () => {
    if (rate > 0 && message.length > 0) {
      axios
        .post(
          'https://eats-apionline.herokuapp.com/api/v1/comment',
          encryptJSON({
            id: props.id.split(' ').join('+'),
            message: message,
            rate: rate,
            uid: await AsyncStorage.getItem('id'),
          })
        )
        .then((response) => {
          response.data = decryptJSON(response.data.data)
          setMessage('')
          setRate(0)
        })
    } else {
      setSubmitted({
        success: false,
        message: 'Please rate and type your message!',
      })
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', paddingTop: 10 }}>
      <Text style={{ ...styles.price, paddingHorizontal: 20 }}>Reviews</Text>
      {props.check ? (
        <>
          <View style={{ paddingHorizontal: 20 }}>
            {createClickableStars(rate, 15, 5, 0.1, setRate)}
          </View>

          <TextInput
            style={{
              height: 80,
              margin: 12,
              borderWidth: 1,
              padding: 10,
              textAlignVertical: 'top',
              borderRadius: 10,
            }}
            onChangeText={setMessage}
            value={message}
            placeholder="Type message"
            keyboardType="text"
            multiline={true}
          />
          <SecondaryButton
            cart={false}
            title="Post"
            styles={{ backgroundColor: '#d6faf4', width: 100, marginLeft: 10 }}
            onPress={() => sendComment()}
          />
        </>
      ) : (
        <Text
          style={{
            ...styles.price,
            paddingHorizontal: 20,
            fontSize: 12,
            color: 'red',
            lineHeight: 18,
          }}
        >
          You should atleast have one completed transaction containing this
          product to submit a comment or review.
        </Text>
      )}
      <ScrollView style={{ padding: 10 }}>
        {comments.map((d, i) => (
          <View
            style={{ flexDirection: 'row', width: '100%', padding: 10 }}
            key={i}
          >
            <View style={{ width: 50 }}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 45,
                  borderWidth: 1,
                  borderColor: 'black',
                }}
                source={
                  d[1].img
                    ? { uri: d[1].img }
                    : require('../../assets/EOLogoYellowGlow.png')
                }
              />
            </View>
            <View>
              <Text style={{ fontWeight: 'bold' }}>
                {d[1].name.length > 12
                  ? d[1].name.substr(0, 12) + '...'
                  : d[1].name}
              </Text>
              {createStars(d[1].rating, 15, 5, 0.1)}
              <Text>{d[1].message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const ProductDetails = ({ navigation, route }) => {
  const [item, setItem] = useState({})
  const [num, setNum] = useState(1)
  const [checker, setCheckB] = useState(null)
  const [cartV, setCartV] = useState([])
  React.useEffect(async () => {
    const resp2 = await axios.get(
      `https://eats-apionline.herokuapp.com/api/v1/checkIfBought?data=${JSON.stringify(
        encryptJSON({
          id: await AsyncStorage.getItem('id'),
          pid: route.params.productid,
        })
      )}`
    )
    setCartV(route.params.cartinuser)
    const check = decryptJSON(resp2.data.data)
    setItem(route.params)
    setCheckB(check.check)
    if (route.params.productid)
      socket.on(decrypt(route.params.productid), (data) => {
        setItem(data)
      })
  }, [route.params])
  React.useEffect(async () => {
    socket.emit(`userinfocart`, await AsyncStorage.getItem('id'))
    socket.on(`cart/${decrypt(await AsyncStorage.getItem('id'))}`, (data) => {
      setCartV(data)
    })
  }, [])
  return (
    <SafeAreaView style={{ backgroundColor: 'yellow', flex: 1 }}>
      <View style={styles.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Details</Text>
      </View>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 180,
            paddingBottom: 20,
            backgroundColor: 'yellow',
          }}
        >
          <Image
            source={{ uri: item.link }}
            style={{ height: '100%', width: 180, borderRadius: 10 }}
          />
        </View>
        <View style={{ backgroundColor: 'yellow' }}>
          <View style={styles.details}>
            <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}
                >
                  {item.title}
                </Text>
                {!cartV.includes(
                  item.productid ? decrypt(item.productid) : null
                ) ? (
                  <View
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      flexDirection: 'row',
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: '#d6faf4',
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                      }}
                      onPress={() => (num <= 1 ? setNum(1) : setNum(num - 1))}
                    >
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        -
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: '#abdcdc',
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        {num}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: '#d6faf4',
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                      }}
                      onPress={() =>
                        num >= 100 ? setNum(100) : setNum(num + 1)
                      }
                    >
                      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text>In Cart</Text>
                )}
              </View>
              <Text style={styles.price}>Php{item.price?.toFixed(2) ?? 0}</Text>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    ...styles.detailText1,
                    flexDirection: 'row',
                    height: 40,
                  }}
                >
                  {createStars(item.comments, 15, 5, 0.1)}

                  <Text
                    style={{
                      textAlignVertical: 'top',
                      marginVertical: 4,
                      marginLeft: 2,
                    }}
                  >
                    {item.comments}
                  </Text>
                </View>
                <Text style={styles.detailText2}>{item.totalsold} sold</Text>
              </View>
              <View
                style={{
                  width: '200%',
                  left: -100,
                  height: 2,
                  backgroundColor: 'lightgrey',
                }}
              ></View>
              <View style={{ paddingVertical: 5 }}>
                <Text style={{ ...styles.detailText1, fontWeight: 'bold' }}>
                  Description
                </Text>
                <Text style={styles.detailText}>{item.description}</Text>
              </View>
              <View
                style={{
                  width: '200%',
                  left: -100,
                  height: 2,
                  backgroundColor: 'lightgrey',
                }}
              ></View>
              <View style={{ paddingTop: 10, flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    width: '50%',
                    fontWeight: 'bold',
                  }}
                >
                  Category
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    width: '50%',
                    fontWeight: 'bold',
                  }}
                >
                  Supplier
                </Text>
              </View>
              <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <Text style={{ ...styles.detailText2, width: '50%' }}>
                  {item.type}
                </Text>
                <Text style={{ ...styles.detailText2, width: '50%' }}>
                  {item.seller}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '200%',
                left: -100,
                height: 20,
                backgroundColor: 'lightgrey',
              }}
            ></View>
            <Comments id={item.productid} check={checker} />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'relative',
          backgroundColor: 'white',
          width: '100%',
          bottom: 1,
          paddingHorizontal: 10,
        }}
      >
        {!cartV.includes(item.productid ? decrypt(item.productid) : null) ? (
          <SecondaryButton
            cart={true}
            title="Add To Cart"
            onPress={() => addCart(item.productid, num)}
          />
        ) : (
          <SecondaryButton
            styles={{ backgroundColor: '#abdcdc' }}
            title="In Cart"
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default ProductDetails

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  details: {
    backgroundColor: 'white',
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
    lineHeight: 30,
    fontSize: 15,
    color: 'black',
  },
  detailText1: {
    lineHeight: 30,
    fontSize: 15,
    color: 'black',
    width: '40%',
  },
  detailText2: {
    lineHeight: 30,
    fontSize: 15,
    color: 'black',
    width: '60%',
  },
  price: {
    fontWeight: 'bold',
    lineHeight: 30,
    fontSize: 16,
    color: 'black',
  },
})
