import { configureStore } from '@reduxjs/toolkit'
import addPatientSlice from './addPatientSlice.js'

const store = configureStore({
  reducer: {
     form: addPatientSlice
  },
})

export default store;