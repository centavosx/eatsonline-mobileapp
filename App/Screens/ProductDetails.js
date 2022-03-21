import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { SecondaryButton } from '../Components/Button';

const ProductDetails = ({ navigation, route }) => {
    const item = route.params;
    return (
        <SafeAreaView style={{ backgroundColor: '#d6faf4' }}>
            <View style={styles.header}>
                <Icon name='arrow-back-ios' size={28} onPress={navigation.goBack} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Details</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 280
                }}>
                    <Image source={item.image} style={{ height: 220, width: 220 }} />
                </View>
                <View style={styles.details}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>{item.name}</Text>
                        <View style={styles.IconContainer}>
                            <Icon name='favorite-border' color={'red'} size={30} />
                        </View>
                    </View>
                    <Text style={styles.detailText}>500g Romanian origin beef brisket brined, dried, seasoned with herbs and spices, smoked and steamed</Text>
                    <View style={{ marginTop: 40, marginBottom: 40 }}>
                        <SecondaryButton title='Add To Cart' onPress={() => navigation.navigate('AddCart')} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProductDetails;

const styles = StyleSheet.create({
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
    },
    details: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60,
        backgroundColor: '#eaec31',
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
        marginTop: 10,
        lineHeight: 30,
        fontSize: 18,
        color: 'black',
    }
});