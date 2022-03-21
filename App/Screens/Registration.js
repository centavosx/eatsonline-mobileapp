import React, { useState } from 'react'
import 'react-native-gesture-handler';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import image1 from '../../assets/EOLogoYellowGlow.png';
import FormInput from '../Components/FormInput';
import FormButton from '../Components/FormButton';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const NavigationStack = createNativeStackNavigator();
const navigation = navigation;

const Registration = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [address, setAddress] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    return (
        <View style={styles.container}>
            <Image source={image1} style={styles.logo} />
            <Text style={styles.text}>Create an account</Text>
            <FormInput
                labelValue={email}
                onChangeText={(userEmail) => setEmail(userEmail)}
                placeholderText="Email"
                iconType="user"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <FormInput
                labelValue={address}
                onChangeText={(userPassword) => setPassword(userPassword)}
                placeholderText="Address"
                iconType="home"
            />
            <FormInput
                labelValue={phoneNumber}
                onChangeText={(userPassword) => setPassword(userPassword)}
                placeholderText="Phone Number"
                iconType="phone"
            />
            <FormInput
                labelValue={password}
                onChangeText={(userPassword) => setPassword(userPassword)}
                placeholderText="Password"
                iconType="lock"
                secureTextEntry={true}
            />

            <FormInput
                labelValue={confirmPassword}
                onChangeText={(userPassword) => setConfirmPassword(userPassword)}
                placeholderText="Confirm Password"
                iconType="lock"
                secureTextEntry={true}
            />

            <FormButton
                buttonTitle="Sign Up"
                onPress={() => register(email, password)}
            />
            <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.navButtonText} onPress={() => navigation.navigate('Login')}>Alreay have an account? Login Now!</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Registration;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d6faf4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: 'cover',
    },
    text: {
        fontSize: 28,
        marginBottom: 10,
        color: '#051d5f',
    },
    navButton: {
        marginTop: 15,
    },
    forgotButton: {
        marginVertical: 35,
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 35,
        justifyContent: 'center',
    },
    color_textPrivate: {
        fontSize: 13,
        fontWeight: '400',
        color: 'grey',
    },
});
