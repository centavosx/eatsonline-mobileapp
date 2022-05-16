import React, { useState } from 'react'
import 'react-native-gesture-handler'
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import Swiper from 'react-native-swiper'
import Entypo from 'react-native-vector-icons/Entypo'
import { addCart } from './Featured'
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import categories from '../Components/Categories'
import food from '../Components/Food'
import { screenWidth } from '../Components/Dimension'
import axios from 'axios'
import socket from '../../socket'
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import { useFocusEffect } from '@react-navigation/native'

const cardWidth = screenWidth / 2 - 20

const Home = ({ navigation, cart, header }) => {
  const [products, setProducts] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      header(null)
    }, [])
  )
  React.useEffect(async () => {
    const resp = await axios.get(
      'https://eats-apionline.herokuapp.com/api/v1/getData',
      {
        params: {
          data: JSON.stringify(
            encryptJSON({
              reference: 'products',
              sortwhat: 'totalsold',
              index: [0, 6],
            })
          ),
        },
      }
    )
    resp.data = decryptJSON(resp.data.data)
    if (!resp.data.error) {
      setProducts(resp.data.data)
    }

    socket.on('featured', (data) => {
      setProducts(data)
    })
  }, [])

  const createStars = (n) => {
    let v = []
    for (let x = 1; x <= 5; x++) {
      if (x <= n) {
        v.push(<Entypo name="star" key={x} size={10} color="#e1ad01" />)
      } else {
        v.push(<Entypo name="star" key={x} size={10} color="grey" />)
      }
    }
    return (
      <View
        style={{ flexDirection: 'row', marginTop: -25, marginHorizontal: 20 }}
      >
        {v.map((d) => d)}
      </View>
    )
  }

  const Card = ({ food, id }) => {
    return (
      <View style={styles.card}>
        <View style={{ alignItems: 'center', top: -40 }}>
          <TouchableHighlight
            underlayColor={'#2aece3'}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('Product', {
                productid: id,
                cartinuser: cart,
                ...food,
              })
            }
          >
            <Image
              source={{ uri: food.link }}
              style={{ height: 120, width: 120, borderRadius: 10 }}
            />
          </TouchableHighlight>
          {food.discount ? (
            <View
              style={{
                marginHorizontal: '35%',
                backgroundColor: 'red',
                borderRadius: 5,
                padding: 2,
                position: 'absolute',
                top: -8,
                borderColor: 'black',
                borderWidth: 1,
              }}
            >
              <Text
                style={{ color: 'white', fontSize: 10, textAlign: 'center' }}
              >
                {food.discount}%
              </Text>
            </View>
          ) : null}
          {cart.includes(decrypt(id)) ? (
            <View
              style={{
                marginHorizontal: '35%',
                backgroundColor: '#d6faf4',
                borderRadius: 5,
                padding: 2,
                position: 'absolute',
                bottom: -8,
                borderColor: 'black',
                borderWidth: 1,
              }}
            >
              <Text
                style={{ color: 'black', fontSize: 10, textAlign: 'center' }}
              >
                CART
              </Text>
            </View>
          ) : null}
        </View>
        {createStars(food.comments ?? 0)}
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{food.title}</Text>
          <Text style={{ fontSize: 14, color: 'grey', marginTop: 2 }}>
            {food.seller}
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', width: '60%' }}>
            {Number(food.price).toFixed(2)}
          </Text>
          <TouchableHighlight
            underlayColor={'#2aece3'}
            activeOpacity={0.9}
            onPress={async () => await addCart(id)}
            style={styles.addToCardBtn}
          >
            <Icon name="add" size={25} color={'white'} />
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  //---------------------------USER INTERFACE--------------------------------
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
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Home</Text>
        </View>
        <View style={styles.slider}>
          <View style={styles.sliderContainer}>
            <Swiper
              height={'100%'}
              autoplay
              activeDotColor="red"
              dotColor="#2aece3"
            >
              {products.map((food, index) => (
                <View style={styles.slide} key={index}>
                  <Image
                    style={styles.sliderImage}
                    resizeMode="cover"
                    source={{ uri: food[1].link }}
                  />
                </View>
              ))}
            </Swiper>
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.UserText}>Featured Products</Text>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 0.4 }}
          numColumns={2}
          data={products}
          renderItem={({ item }, i) => (
            <Card food={item[1]} key={i} id={item[0]} />
          )}
        />
      </View>
    </View>
  )
}
export default Home

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
    backgroundColor: '#d6faf4',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  Text: {
    fontSize: 25,
  },
  UserText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  TextIntro: {
    marginTop: 5,
    fontSize: 18,
    color: 'grey',
  },
  UserImage: {
    height: 70,
    width: 70,
    borderRadius: 25,
  },
  body: {
    marginTop: 30,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  InputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#2aece3',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  search: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 5,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: '#eaec31',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 50,
    width: 150,
    marginRight: 7,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 235,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: 'white',
  },
  addToCardBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: '10%',
    backgroundColor: '#eaec31',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  slider: {
    flex: 0.5,
    alignItems: 'center',
  },
  sliderContainer: {
    height: '95%',
    width: '90%',
    marginTop: 10,
    borderRadius: 8,
  },
  slide: {
    flex: 0.8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 10,
  },
  sliderImage: {
    height: 180,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 30,
  },
})
