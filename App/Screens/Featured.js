import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableHighlight,FlatList } from 'react-native'
import Swiper from 'react-native-swiper';
import food from '../Components/Food';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Featured({navigation}) {



   

    return (
        <SafeAreaView style={styles.SafeArea} >
            <View style={styles.header}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.Text}>Eats</Text>
                        <Text style={styles.UserText}>Online</Text>
                    </View>
                    <Text style={styles.TextIntro}>Featured products.</Text>
                </View>
                <Image style={styles.UserImage} source={require('../../assets/EOLogoYellowGlow.png')} />
            </View>
            <View style={styles.slider}>
            <View style={styles.sliderContainer}>
            <Swiper height={"100%"} autoplay activeDotColor='red' dotColor='#2aece3' >
            {
                food.map((food, index) =>              
                    <View style={styles.slide} key={food.id}>
                        <Image style={styles.sliderImage}
                            resizeMode="cover"
                            source={food.image}
                        />
                        <View style={styles.card}>
                        <Text style={styles.userName}>{food.name}</Text>
                        <Text style={styles.result}>Ingredients: {food.ingredients}</Text>
                        <Text style={styles.result}>Description: {food.description}</Text>
                        <Text style={styles.userName}>{food.price}</Text>
                        <View style={{alignSelf:'flex-end', paddingRight: 15}}>
                        <TouchableHighlight style={styles.addToCardBtn}  onPress={() => navigation.navigate('Product', food)}> 
                            <Icon name='add' size={30} color={'white'} />
                        </TouchableHighlight>
                        </View>
                        </View>                 
                    </View>
                )            
            }
            </Swiper>
            </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    SafeArea: {
        flex: 1,
        backgroundColor: '#d6faf4',
    },
    header: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    Text: {
        fontSize: 25,
        color: "red",
        fontWeight: 'bold',
    },
    TextIntro: {
        marginTop: 5,
        fontSize: 18,
        color: 'black',
    },
    UserText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 5,
        color: 'red',
    },
    UserImage: {
        height: 70,
        width: 70,
        borderRadius: 35,
    },
    card:{
        backgroundColor: 'rgba(234,236,49, .8)',
        width: "100%",
        marginBottom: 20,
        borderRadius:10,
        paddingBottom: 8,
        paddingTop: 8
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'black',
        textAlign: 'center',
        textDecorationLine: 'underline',
      },
      result: {
        fontSize: 12,
        textAlign:'justify',
        marginBottom: 10,
        color: 'black',
        marginLeft: '10%',
        marginRight: '10%'
      },
      slider: {
        flex: 1,
        alignItems: 'center'
      },
      sliderContainer: {
          height: '95%',
          width: '90%',
          marginTop: 10,
          borderRadius: 8,
      },
      slide: {
          flex: 1,
          backgroundColor: 'transparent',
          borderRadius: 8,
          padding: 10
      },
      sliderImage: {
          height: 150,
          width: '100%',
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 8,
          marginBottom: 30
      },
      addToCardBtn: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#2aece3',
        justifyContent: 'center',
        alignItems: 'center',
    },
});