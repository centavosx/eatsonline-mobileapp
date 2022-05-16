import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import 'react-native-gesture-handler'

const PrimaryButton = ({ title, onPress = () => {}, styles, fontstyles }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={{ ...style.btnContainer, ...styles }}>
        <Text style={{ ...style.title, ...fontstyles }}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}
const SecondaryButton = ({ styles, cart, title, onPress = () => {} }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View
        style={{
          ...style.btnContainer,
          backgroundColor: '#e1ad01',
          flexDirection: 'row',
          ...styles,
        }}
      >
        {cart ? (
          <AntDesign name="shoppingcart" size={25} style={{ marginRight: 5 }} />
        ) : null}
        <Text style={{ ...style.title, color: 'black' }}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}
export { PrimaryButton, SecondaryButton }

const style = StyleSheet.create({
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  btnContainer: {
    backgroundColor: 'yellow',
    height: 40,
    borderColor: 'lightgrey',
    borderWidth: 1,
    elevation: 7,
    shadowColor: 'black',
    shadowRadius: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
})
