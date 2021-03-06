import React from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { windowHeight, windowWidth } from '../Components/Dimension'

const FormInput = ({
  labelValue,
  placeholderText,
  iconType,
  avail,
  availType,
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconStyle}>
        <AntDesign name={iconType} size={25} color="red" />
      </View>
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="grey"
        {...rest}
      />
      {avail ? (
        <AntDesign
          name={availType}
          size={25}
          style={{ left: -5 }}
          color="red"
        />
      ) : null}
    </View>
  )
}

export default FormInput

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: 'yellow',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2aece3',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'black',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,

    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
})
