const CryptoJS = require('crypto-js')

export const encrypt = (text) => {
  const passphrase = 'EatsOnline2020'
  return CryptoJS.AES.encrypt(text, passphrase).toString()
}
export const decrypt = (text) => {
  const passphrase = 'EatsOnline2020'
  var bytes = CryptoJS.AES.decrypt(text, passphrase)
  return bytes.toString(CryptoJS.enc.Utf8)
}
export const decryptJSON = (text) => {
  const passphrase = 'EatsOnline2020'
  var bytes = CryptoJS.AES.decrypt(text, passphrase)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
export const encryptJSON = (json) => {
  const passphrase = 'EatsOnline2020'
  return {
    data: CryptoJS.AES.encrypt(JSON.stringify(json), passphrase).toString(),
  }
}
