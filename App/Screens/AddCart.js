import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, ListFooterComponent, ListFooterComponentStyle } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import food from '../Components/Food';
import { PrimaryButton } from '../Components/Button';

const AddCart = ({ navigation }) => {
    const CartCard = ({ item }) => {
        return (
            <View style={styles.cartCard}>
                <Image style={{ height: 80, width: 80 }} source={item.image} />
                <View style={{ height: 100, marginLeft: 10, paddingVertical: 20, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.name}</Text>
                    <Text style={{ fontSize: 13, color: 'grey', marginBottom: 5 }}>{item.ingredients}</Text>
                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item.price}</Text>
                </View>
                <View style={{ marginRight: 20, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>3</Text>
                    <View style={styles.actionBtn}>
                        <Icon name='remove' size={25} color={'white'} />
                        <Icon name='add' size={25} color={'white'} />
                    </View>
                </View>
            </View>
        );
    };
    return (
        <SafeAreaView style={{ backgroundColor: '#d6faf4', flex: 1 }}>
            <View style={styles.header}>
                <Icon name="arrow-back-ios" size={28} onPress={navigation.goBack} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cart</Text>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                data={food}
                renderItem={({ item }) => <CartCard item={item} />}
                ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
                ListFooterComponent={() => (
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 15
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total Price</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>₱550</Text>
                        </View>
                        <View style={{ marginHorizontal: 30 }}>
                            <PrimaryButton title='CHECKOUT' />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    )
};
export default AddCart;

const styles = StyleSheet.create({
    header: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
    },
    cartCard: {
        height: 100,
        elevation: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        width: 80,
        height: 30,
        backgroundColor: '#eaec31',
        borderRadius: 30,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    }
});