import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import image1 from '../../assets/EOLogoYellowGlow.png'
const Loading = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={image1} />
      <Text>Loading...</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
    paddingTop: '20%',
    backgroundColor: '#d6faf4',
  },
  logo: {
    height: 200,
    width: 200,
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
    textAlign: 'center',
    color: 'blue',
    fontSize: 20,
  },
})

export default Loading
