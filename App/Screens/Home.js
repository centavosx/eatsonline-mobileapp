import React from 'react'
import 'react-native-gesture-handler';
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { FlatList, ScrollView, TextInput, TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import categories from '../Components/Categories';
import food from '../Components/Food';
import { screenWidth } from '../Components/Dimension';

const cardWidth = screenWidth / 2 - 20;

const Home = ({ navigation }) => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    
    const Card = ({ food }) => {
        return (
            <TouchableHighlight
                underlayColor={'#2aece3'}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Product', food)}>
                <View style={styles.card}>
                    <View style={{ alignItems: 'center', top: -40 }}>
                        <Image source={food.image} style={{ height: 120, width: 120 }} />
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: -20, }}>{food.name}</Text>
                        <Text style={{ fontSize: 14, color: 'grey', marginTop: 2, }}>{food.ingredients}</Text>
                    </View>
                    <View style={{
                        marginTop: 10,
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{food.price}</Text>
                        <View style={styles.addToCardBtn}>
                            <Icon name='add' size={25} color={'white'} />
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };
    const ListCategories = () => {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainerStyle}>
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => setSelectedCategoryIndex(index)}>
                        <View style={{
                            backgroundColor:
                                selectedCategoryIndex == index
                                    ? '#eaec31'
                                    : '#E5E6A1',
                            ...styles.categoryBtn,
                        }}>
                            <View style={styles.categoryBtnImgCon}>
                                <Image
                                    source={category.image}
                                    style={{ height: 25, width: 25, resizeMode: 'cover' }}
                                />
                            </View>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                marginLeft: 10,
                                color:
                                    selectedCategoryIndex == index
                                        ? 'black'
                                        : 'grey',
                            }}>{category.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )
    };
    //---------------------------USER INTERFACE--------------------------------
    return (
        <SafeAreaView style={styles.SafeArea}>
            <View style={styles.header}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.Text}>Hello, </Text>
                        <Text style={styles.UserText}>Jichuu</Text>
                    </View>
                    <Text style={styles.TextIntro}>What do you want for today?</Text>
                </View>
                <Image style={styles.UserImage} source={require('../../assets/EOLogoYellowGlow.png')} />
            </View>
            <View style={styles.body}>
                <View style={styles.InputContainer}>
                    <Icon name="search" size={30} />
                    <TextInput style={styles.search} placeholder="Search for food" />
                </View>
                <View style={styles.sortBtn}>
                    <Icon name="tune" size={30} color={'#2aece3'} />
                </View>
            </View>
            <View>
                <ListCategories />
            </View>
            {/*------------------SCROLL VIEW------------------*/}
            <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={food}
                renderItem={({ item }) => <Card food={item} />}
            />
        </SafeAreaView>
    )
};
export default Home;

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
    UserText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    TextIntro: {
        marginTop: 5,
        fontSize: 18,
        color: 'grey',
    },
    UserImage: {
        height: 70,
        width: 70,
        borderRadius: 25,
    },
    body: {
        marginTop: 40,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    InputContainer: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: '#2aece3',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    search: {
        flex: 1,
        fontSize: 18,
        paddingHorizontal: 5,
    },
    sortBtn: {
        width: 50,
        height: 50,
        marginLeft: 10,
        backgroundColor: '#eaec31',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainerStyle: {
        paddingVertical: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    categoryBtn: {
        height: 50,
        width: 150,
        marginRight: 7,
        borderRadius: 30,
        alignItems: 'center',
        paddingHorizontal: 5,
        flexDirection: 'row',
    },
    categoryBtnImgCon: {
        height: 35,
        width: 35,
        backgroundColor: 'white',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        height: 220,
        width: cardWidth,
        marginHorizontal: 10,
        marginBottom: 20,
        marginTop: 50,
        borderRadius: 15,
        elevation: 13,
        backgroundColor: 'white',
    },
    addToCardBtn: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 15,
        backgroundColor: '#eaec31',
        justifyContent: 'center',
        alignItems: 'center',
    },
});