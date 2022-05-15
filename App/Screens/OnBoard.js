import React from 'react'
import { View, SafeAreaView, StyleSheet, Image, Text } from 'react-native'
import { PrimaryButton } from '../Components/Button'
import { windowWidth, windowHeight } from '../Components/Dimension'

const navigation = navigation
const OnBoard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.View}>
        <Image
          style={styles.Logo}
          source={require('../../assets/EOLogoYellowGlow.png')}
        />
      </View>
      <View style={styles.textcontainer}>
        <View>
          <Text style={styles.Text}>Eats Online</Text>
          <Text style={styles.Text1}>
            Your One-stop Shop for Regional Delicacies!
          </Text>
        </View>
        <View style={styles.indicatorContainer}>
          <View style={styles.currentIndicator}></View>
          <View style={styles.indicator}></View>
          <View style={styles.indicator}></View>
        </View>
        <PrimaryButton
          onPress={() => navigation.navigate('Login')}
          title="Get Started"
        />
      </View>
    </SafeAreaView>
  )
}
export default OnBoard

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
    backgroundColor: '#d6faf4',
  },

  View: {
    height: 400,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Logo: {
    width: '80%',
    resizeMode: 'contain',
    top: -780,
  },
  Text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  Text1: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'grey',
  },
  textcontainer: {
    flex: 1,
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  indicatorContainer: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentIndicator: {
    height: 12,
    width: 30,
    borderRadius: 10,
    backgroundColor: 'yellow',
    marginHorizontal: 5,
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'grey',
    marginHorizontal: 5,
  },
})
