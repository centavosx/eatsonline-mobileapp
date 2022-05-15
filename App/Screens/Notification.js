import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import { decrypt } from '../../Encryption'

export default function Notification({ navigation, notifications }) {
  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
          Notifications
        </Text>
      </View>
      <ScrollView
        style={{ flex: 1, padding: 20, marginBottom: 20 }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((data, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate('Transaction', {
                data: {
                  keyid: data[0][0],
                  what: decrypt(data[0][1]),
                  ...data[1],
                },
              })
            }
            style={{ width: '100%' }}
          >
            <View style={styles.card} key={index}>
              <Text style={styles.userName}>{data[1].status}</Text>
              <Text style={{ fontWeight: 'bold', ...styles.result }}>
                Your order is now{' '}
                {data[1].status === 'Delivering'
                  ? 'being delivered'
                  : data[1].status.toLowerCase()}
              </Text>
              <Text style={styles.result}>
                Order Id:
                <Text style={{ fontWeight: 'bold' }}>{data[1].id}</Text>
              </Text>
              <Text style={styles.result}>{data[1].pstatus}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
    backgroundColor: '#d6faf4',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  card: {
    backgroundColor: 'rgba(234,236,49, .8)',
    width: '100%',
    marginBottom: 12,
    borderRadius: 10,
    paddingBottom: 8,
    paddingTop: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 8,
    color: 'black',
    textAlign: 'left',
  },
  result: {
    fontSize: 12,
    textAlign: 'justify',

    color: 'black',
    marginLeft: '10%',
    marginRight: '10%',
  },
})
