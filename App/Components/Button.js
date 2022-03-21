import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';

const PrimaryButton = ({ title, onPress = () => { } }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={style.btnContainer}>
                <Text style={style.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};
const SecondaryButton = ({ title, onPress = () => { } }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={{ ...style.btnContainer, backgroundColor: '#2aece3' }}>
                <Text style={{ ...style.title, color: 'white' }}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};
export { PrimaryButton, SecondaryButton };

const style = StyleSheet.create({
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    btnContainer: {
        backgroundColor: 'yellow',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
