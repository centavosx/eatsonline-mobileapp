import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import image1 from '../../assets/EOLogoYellowGlow.png';
import FormInput from '../Components/FormInput';
import FormButton from '../Components/FormButton';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { windowWidth } from '../Components/Dimension';

const NavigationStack = createNativeStackNavigator();
const navigation = navigation;

const Login = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    return (
        <View style={styles.container}>
            <Image source={image1} style={styles.logo} />
            <Text style={styles.text}>Eats Online PH</Text>
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
                labelValue={password}
                onChangeText={(userPassword) => setPassword(userPassword)}
                placeholderText="Password"
                iconType="lock"
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.forgotButton} onPress={() => { }}>
                <Text style={styles.navButtonText}>Forgot Password?</Text>
            </TouchableOpacity>
            <FormButton
                buttonTitle="Sign In"
                onPress={() => login(email, password)}
            />
            <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.navButtonText} onPress={() => navigation.navigate('Register')}>Don't have an acount? Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.buttonText} onPress={() => navigation.navigate("Profile")}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#d6faf4',
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
        marginVertical: 15,
    },
    navButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
    },
    buttonContainer: {
        height: 50,
        width: 150,
        borderRadius: 50,
        backgroundColor: 'yellow',
        paddingVertical: 10,
        justifyContent: 'center',
        marginTop: 15,
    },
    buttonText: {
        textAlign: "center",
        color: "blue",
        fontSize: 20
    },
});
