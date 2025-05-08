import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios.js";
import SummaryApi from "../common/SummaryApi.js";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosTostError from "../utils/AxiosTostError.js";
import toast from "react-hot-toast";
// import { pricewithDiscount } from "../utils/PriceWithDiscount";
// import { handleAddAddress } from "../store/addressSlice";
// import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
     const dispatch = useDispatch()
    


    const fetchCartItems = async()=>{
        try {
          const response = await Axios({
            ...SummaryApi.getCart
          })
    
          const { data : responseData } = response
          if(responseData.success){
             dispatch(handleAddItemCart (responseData.data))
            console.log(responseData.data)
          }
    
        } catch (error) {
          console.log(error)
        }
      }
      const updateCartItem = async(id,qty)=>{
        try {
            const response = await Axios({
              ...SummaryApi.updateCartItemQty,
              data : {
                _id : id,
                qty : qty
              }
            })
            const { data : responseData } = response
  
            if(responseData.success){
                // toast.success(responseData.message)
                fetchCartItems()
                return responseData
            }
        } catch (error) {
          AxiosTostError(error)
          return error
        }
      }
      const deleteCartItem = async(cartId)=>{
        try {
            const response = await Axios({
              ...SummaryApi.deleteCartItem,
              data : {
                _id : cartId
              }
            })
            const { data : responseData} = response
  
            if(responseData.success){
              toast.success(responseData.message)
              fetchCartItems()
            }
        } catch (error) {
           AxiosTostError(error)
        }
      }
  

    useEffect(()=>{
        fetchCartItems()
    
    },[])
    
    return(
        <GlobalContext.Provider value={{
          fetchCartItems,
          updateCartItem,
            deleteCartItem,
          
           
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider