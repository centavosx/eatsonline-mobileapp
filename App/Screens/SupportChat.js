import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image} from 'react-native'
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/FontAwesome';

const Checkout = ({ navigation }) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: 'Hello Derr',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: require('../../assets/EOLogoYellowGlow.png'),
          },
        },
      ])
    }, [])
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    const renderSend = (props) => {
        return(
            <Send {...props}>
                <View>
                    <Icon name='send' size={25} color='#000000' style={{paddingBottom: 9, paddingRight: 13}} />
                </View>
            </Send>
        );
    }



    const renderBubble = (props) => {
        return(
        <Bubble 
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#d6faf4'
                }
            }}
            textStyle={{
                right:{
                    color: 'rgb(0,0,0)'
                }
            }}
            timeTextStyle={{
                left: {
                  color: 'rgb(0,0,0)',
                },
                right: {
                  color: 'black',
                },
              }}
        />
        );
    }

    const scrollToBottomComponent = () => {
        return(
            <Icons name='angle-double-down' size={22} color='red' />
        );
    }


    return (
        <SafeAreaView style={styles.SafeArea}>
            <View style={styles.header1}>
                <Icon1 name="arrow-back-ios" size={28} onPress={navigation.goBack} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
            </View>
            <View style={styles.header}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.Text}>Hello, </Text>
                        <Text style={styles.UserText}>Jichuu </Text>
                    </View>
                    <Text style={styles.TextIntro}>Chat with us.</Text>
                </View>
                <Image style={styles.UserImage} source={require('../../assets/j2.jpg')} />
            </View>

            <View style={styles.card}>
                <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                _id: 1,
                }}
                renderBubble={renderBubble}
                alwaysShowSend
                renderSend={renderSend}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                />
            </View>

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
        borderWidth: 2,
        borderColor: '#000000',  
    },
    card:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0, .5)',
        marginTop: 10,
        borderRadius: 25,
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