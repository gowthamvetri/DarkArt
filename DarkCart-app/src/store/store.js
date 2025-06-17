import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cartReducer from './cartProduct'
import addressReducer from './addressSlice' 
import orderReducer from './orderSlice'// Assuming you have an address slice defined

export const store = configureStore({
  reducer: {
    user : userReducer,
    product : productReducer,
    cartItem : cartReducer,
    addresses: addressReducer, 
    order: orderReducer, // Assuming you have an order slice defined
  },
})