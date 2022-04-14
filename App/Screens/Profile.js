import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput,ScrollView, Image } from 'react-native'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { PrimaryButton } from '../Components/Button';

const Profile = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.SafeArea}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
                <Icon name='shopping-cart' style={styles.cart} onPress={() => navigation.navigate('AddCart')} />
                <Icon name='forum' style={styles.message} />
            </View>
            <View style={styles.body}>
                <Image style={styles.user} source={require('../../assets/j2.jpg')} />
                <View style={styles.InputContainer} >
                    <Text style={styles.Login} onPress={() => navigation.navigate('Login')} >Edit</Text>
                </View>
                <View style={styles.sortBtn}>
                    <Text style={styles.Signup} onPress={() => navigation.navigate('Register')}>Logout</Text>
                </View>                
            </View>
 
            <ScrollView
            style={{flex:1, padding: 20}}
            contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
            showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                <Image style={styles.userImg} source={require('../../assets/j2.jpg')} />
                <Text style={styles.userName} > Jichuu</Text>
                <Text style={styles.aboutUser} > 
                    ImNotScary@gmail.com
                </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.userName}>Order Here</Text>
                    <Text style={styles.result}> Kalamares</Text>
                    <Text style={styles.result}> Kangkong</Text>
                    <Text style={styles.result}> Sibuyas</Text>
                    <Text style={styles.result}> Petchay</Text>
                </View>

            </ScrollView>
       
        </SafeAreaView>

    )
}
export default Profile;
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
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 20,
    },
    cart: {
        fontSize: 28,
        marginLeft: 190,
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
        marginTop: 20,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#000000',  
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
      card:{
        alignItems: 'center',
        backgroundColor: 'rgba(234,236,49, .8)',
        width: "100%",
        marginBottom: 20,
        borderRadius:10,
        paddingBottom: 8,
        paddingTop: 8
      },
      userName: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 8,
        color: 'black',
        textAlign: 'center'
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