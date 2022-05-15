import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { createStars } from './Featured'
import { SecondaryButton } from '../Components/Button'

const Comments = () => {
  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <ScrollView style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', width: '100%', padding: 10 }}>
          <View style={{ width: 50 }}>
            <Image
              style={{
                width: 50,
                borderRadius: 45,
                borderWidth: 1,
                borderColor: 'black',
                height: '100%',
              }}
            />
          </View>
          <View>
            <Text>daw</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const ProductDetails = ({ navigation, route }) => {
  const item = route.params
  return (
    <SafeAreaView style={{ backgroundColor: '#e1ad01', flex: 1 }}>
      <View style={styles.header}>
        <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Details</Text>
      </View>
      <ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 180,
            marginBottom: 20,
          }}
        >
          <Image
            source={{ uri: item.link }}
            style={{ height: '100%', width: 180, borderRadius: 10 }}
          />
        </View>

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
                style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}
              >
                {item.title}
              </Text>
            </View>
            <Text style={styles.price}>Php{item.price.toFixed(2)}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.detailText1}>
                {createStars(item.comments, 15, 5, 0.1)}
                <Text> {item.comments}</Text>
              </Text>
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
          <Comments />
        </View>
      </ScrollView>
      <View
        style={{
          position: 'relative',
          backgroundColor: '#d6faf4',
          width: '100%',
          bottom: 1,
          paddingHorizontal: 10,
        }}
      >
        <SecondaryButton
          title="Add To Cart"
          onPress={() => navigation.navigate('AddCart')}
        />
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
    backgroundColor: '#d6faf4',
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
    fontSize: 18,
    color: 'black',
  },
})
