import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput,ScrollView, Image } from 'react-native'

export default function Notification() {
    return (
        <SafeAreaView style={styles.SafeArea} >
            <View style={styles.header}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.Text}>Hello, </Text>
                        <Text style={styles.UserText}>Jichuu </Text>
                    </View>
                    <Text style={styles.TextIntro}>Notification</Text>
                </View>
                <Image style={styles.UserImage} source={require('../../assets/j2.jpg')} />
            </View>

            <ScrollView
            style={{flex:1, padding: 20}}
            contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
            showsVerticalScrollIndicator={false}
            >
            <View style={styles.card}>
                    <Text style={styles.userName}>Order Arrive</Text>
                    <Text style={styles.result}>Your order has arrived.</Text>            
            </View>

            <View style={styles.card}>
                    <Text style={styles.userName}>Pending Order</Text>
                    <Text style={styles.result}>Your pending is order has been accepted. Your order will arrive in April 3, 2022.</Text>            
            </View>

            </ScrollView>
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
    },
    TextIntro: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    UserText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 5,
        color: 'grey',
    },
    UserImage: {
        height: 70,
        width: 70,
        borderRadius: 35,
    },
    card:{
        backgroundColor: 'rgba(234,236,49, .8)',
        width: "100%",
        marginBottom: 12,
        borderRadius: 10,
        paddingBottom: 8,
        paddingTop: 8
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 8,
        color: 'black',
        textAlign: 'left',
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
});