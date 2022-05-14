import { createSlice } from '@reduxjs/toolkit'
import { checkLogin } from '../api/api'
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    login: checkLogin(
      localStorage.getItem('user'),
      localStorage.getItem('pass')
    ),
  },

  //   removeFloor: (state, action) => {
  //     state[action.payload.floor] = state[action.payload.floor].filter(
  //       (value) => {
  //         return value[action.payload.data.key] != action.payload.data.value
  //       }
  //     )
  //   },
})
export default userSlice.reducer
