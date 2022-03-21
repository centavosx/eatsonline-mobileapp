import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { PrimaryButton } from '../Components/Button';

const Profile = ({ navigation }) => {
    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
                <Icon name='shopping-cart' style={styles.cart} onPress={() => navigation.navigate('AddCart')} />
                <Icon name='forum' style={styles.message} />
            </View>
            <View style={styles.body}>
                <Icon name='account-circle' style={styles.user} />
                <View style={styles.InputContainer} >
                    <Text style={styles.Login} onPress={() => navigation.navigate('Login')} >Login</Text>
                </View>
                <View style={styles.sortBtn}>
                    <Text style={styles.Signup} onPress={() => navigation.navigate('Register')}>Sign Up</Text>
                </View>
            </View>

        </SafeAreaView>

    )
}
export default Profile;
const styles = StyleSheet.create({
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
        fontSize: 70,
        marginTop: -10,
        marginLeft: -10,
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
});