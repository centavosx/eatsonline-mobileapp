import React, {useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import food from '../Components/Food';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import payment from '../Components/PaymentMethod';
import delivery from '../Components/Delivery';
import { PrimaryButton } from '../Components/Button';

const Checkout = ({ navigation }) => {

    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    const [selectedDelivery, setSelectedDelivery] = React.useState(0);
    const [userInput, setUserInput] = useState("")

    const PaymentMethod = () => {
        return (
            <View style={{flexDirection: "row"}}>
                {payment.map((payment, index) => (
                    <TouchableOpacity
                        key={payment.id}
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
                                 <Icon2 name={payment.name} size={30} />
                            </View>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                marginLeft: 10,
                                color:
                                    selectedCategoryIndex == index
                                        ? 'black'
                                        : 'grey',
                            }}>{payment.name1}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        )
    };

    const Delivery = () => {
        return (
            <View style={{flexDirection: "row", marginTop: 10}}>
                {delivery.map((delivery, index) => (
                    <TouchableOpacity
                        key={delivery.id}
                        activeOpacity={0.8}
                        onPress={() => setSelectedDelivery(index)}>
                        <View style={{
                            backgroundColor:
                                            selectedDelivery == index
                                    ? '#eaec31'
                                    : '#E5E6A1',
                            ...styles.categoryBtn,
                        }}>
                            <View style={styles.categoryBtnImgCon}>
                                 <Icon2 name={delivery.name} size={30} />
                            </View>
                            
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                marginLeft: 10,
                                color:
                                                selectedDelivery == index
                                        ? 'black'
                                        : 'grey',
                            }}>{delivery.name1}</Text>
                        </View>
                        
                    </TouchableOpacity>
                    
                ))}
                
            </View>
            
        )
    };
    
    return (
        <SafeAreaView style={styles.SafeArea}>
            <View style={styles.header1}>
                <Icon1 name="arrow-back-ios" size={28} onPress={navigation.goBack} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Review Cart</Text>
            </View>
            <View style={styles.header}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.Text}>Hello, </Text>
                        <Text style={styles.UserText}>Jichuu </Text>
                    </View>
                    <Text style={styles.TextIntro}>Checkout</Text>
                </View>
                <Image style={styles.UserImage} source={require('../../assets/j2.jpg')} />
            </View>

            <ScrollView style={styles.scroller} 
                contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                showsVerticalScrollIndicator={false} 
            >
                <View style={styles.card}>
                    <Text style={styles.userName}>Checkout Items</Text>
                    {
                        food.map((food, index) => 
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: .1, marginLeft: 10}}>
                            <Icon name='check-square-o' size={30} color={'black'} />
                            </View>
                            <View style={{flex: .6, alignSelf: 'flex-start'}}>
                            <Text style={styles.result} key={food.id}>{food.id}pc of {food.name} </Text>
                            </View>
                            <View style={{flex: .3, alignSelf: 'flex-start'}}>
                            <Text style={styles.result} key={food.id}>{food.price}</Text>
                            </View>
                        </View>
                        )
                    }
                        
                        <View style={{alignSelf: 'flex-end', paddingRight: 36}}>
                        <Text style={styles.result1}>Total: ₱550.00</Text>
                        </View>            
                </View>

                <PaymentMethod />
                <Delivery />
                
                <View style={styles.card}>
                <Text style={styles.userName}>Date of arrival</Text>
                <Text style={styles.result}>Pwede pumili pag advance order</Text>
                </View>

                <View style={styles.card}>
                <Text style={styles.userName}>Address</Text>
                <Text style={styles.result}>2 Kalamares S.T. Baranggay Sibuyas Quezon Rizal.</Text>
                </View>

                <View style={styles.card}>
                <Text style={styles.userName}>Add comment</Text>
                <View style={styles.action}>
                <TextInput
                    placeholder="Comment"
                    placeholderTextColor="#000000"
                    style={styles.textInput}
                    multiline={true}
                    autoCapitalize="none"
                    onChangeText={(val) => setUserInput(val)}
                />
                </View>
                </View>

                <View style={{ width: "100%" }}>
                    <PrimaryButton 
                    title='ADD ADDRESS' 
                    onPress={() => alert("Yeah hey")}
                    />
                    <PrimaryButton 
                    title='PAY' 
                    onPress={() => alert(userInput)}
                    />
                </View>
                  
            </ScrollView>

        </SafeAreaView>
    )
};
export default Checkout;

const styles = StyleSheet.create({
    SafeArea: {
        flex: 1,
        backgroundColor: '#d6faf4',
    },
    scroller: {
        flex: 1,
        margin: 20,
    },
    header: {
       
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    header1: {
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
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
        marginTop: 12,
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
        color: 'black',
        marginLeft: 8,
        margin: 5, 
      },
      result1: {
        fontSize: 14,
        textAlign:'justify',
        color: 'black',
        fontWeight: 'bold',
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
        backgroundColor: 'transparent',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: '#000000',
        paddingBottom: 5,
        marginBottom: 10,
        marginLeft: '8%',
        marginRight: '8%',
      },
      textInput: {
        flex: 1,
        paddingLeft: 8,
        color: '#000000',
        fontSize: 12,
    
      },
});