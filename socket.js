import io from 'socket.io-client'
const socket = io('ws://eats-apionline.herokuapp.com', {
  transports: ['websocket', 'polling'],
})

export default socket
