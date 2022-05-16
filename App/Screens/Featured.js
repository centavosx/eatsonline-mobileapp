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
import Entypo from 'react-native-vector-icons/Entypo'
import axios from 'axios'
import socket from '../../socket'
import { decrypt, decryptJSON, encrypt, encryptJSON } from '../../Encryption'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
const cardWidth = screenWidth / 2 - 20
export const addCart = async (id, num) => {
  await axios.post(
    'https://eats-apionline.herokuapp.com/api/v1/addcart',
    encryptJSON({
      id: await AsyncStorage.getItem('id'),
      cartid: id,
      amount: num ? num : 1,
    })
  )
}
export const createStars = (n, s, mT, mH) => {
  let v = []
  for (let x = 1; x <= 5; x++) {
    if (x <= n) {
      v.push(<Entypo name="star" key={x} size={!s ? 10 : s} color="#e1ad01" />)
    } else {
      v.push(<Entypo name="star" key={x} size={!s ? 10 : s} color="grey" />)
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

const Home = ({ navigation, cart, header }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [cat, setCat] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      header('Menu')
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
            })
          ),
        },
      }
    )
    const resp2 = await axios.get(
      'https://eats-apionline.herokuapp.com/api/v1/category'
    )

    resp.data = decryptJSON(resp.data.data)
    if (!resp.data.error) {
      setProducts(resp.data.data)
    }
    const ca = decryptJSON(resp2.data.data)
    setCat(ca.data)
    socket.on('products', (data) => {
      setProducts(data)
    })
  }, [])

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
            style={styles.addToCardBtn}
            underlayColor={'#2aece3'}
            activeOpacity={0.9}
            onPress={() => addCart(id)}
          >
            <Icon name="add" size={25} color={'white'} />
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  const ListCategories = (props) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <TouchableOpacity
          key={0}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedCategoryIndex(0)
            setType('type')
            setSearch('')
          }}
        >
          <View
            style={{
              backgroundColor:
                selectedCategoryIndex == 0 ? '#eaec31' : '#E5E6A1',
              ...styles.categoryBtn,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 10,
                color: selectedCategoryIndex === 0 ? 'black' : 'grey',
              }}
            >
              All
            </Text>
          </View>
        </TouchableOpacity>
        {props.cat.map((category, index) => (
          <TouchableOpacity
            key={index + 1}
            activeOpacity={0.8}
            onPress={() => {
              setSelectedCategoryIndex(index + 1)
              setType('type')
              setSearch(category)
            }}
          >
            <View
              style={{
                backgroundColor:
                  selectedCategoryIndex == index + 1 ? '#eaec31' : '#E5E6A1',
                ...styles.categoryBtn,
              }}
            >
              {categories.find((x) => x.name === category) ? (
                <View style={styles.categoryBtnImgCon}>
                  <Image
                    source={
                      categories.find((x) => x.name === category)?.image ?? null
                    }
                    style={{ height: 25, width: 25, resizeMode: 'cover' }}
                  />
                </View>
              ) : null}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginLeft: 10,
                  color: selectedCategoryIndex == index + 1 ? 'black' : 'grey',
                }}
              >
                {category}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
        <View style={styles.body}>
          <View style={styles.InputContainer}>
            <Icon name="search" size={30} />
            <TextInput
              style={styles.search}
              placeholder="Search food name"
              onChangeText={(v) => {
                setSearch(v)
                setType('title')
              }}
              value={search}
            />
          </View>
        </View>
        <View>
          <ListCategories cat={cat} />
        </View>
        {products.filter(
          (item) =>
            search.length <= 0 ||
            item[1][type].toLowerCase().includes(search.toLowerCase())
        ).length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 0.4 }}
            numColumns={2}
            data={products.filter(
              (item) =>
                search.length <= 0 ||
                item[1][type].toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={({ item }, i) => (
              <Card food={item[1]} key={i} id={item[0]} />
            )}
          />
        ) : (
          <Text style={{ marginHorizontal: 20 }}>No products</Text>
        )}
        {/*------------------SCROLL VIEW------------------*/}
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
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 20,
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
    marginLeft: '15%',
    backgroundColor: '#eaec31',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  slider: {
    flex: 0.35,
    alignItems: 'center',
  },
  sliderContainer: {
    height: '95%',
    width: '90%',
    marginTop: 10,
    borderRadius: 8,
  },
  slide: {
    flex: 0.5,
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 10,
  },
  sliderImage: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 30,
  },
})
