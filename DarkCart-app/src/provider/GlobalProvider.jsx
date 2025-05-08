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

    useEffect(()=>{
        fetchCartItems()
    
    },[])
    
    return(
        <GlobalContext.Provider value={{
          fetchCartItems,
           
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider