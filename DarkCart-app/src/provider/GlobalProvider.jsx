import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios.js";
import SummaryApi from "../common/SummaryApi.js";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosTostError from "../utils/AxiosTostError.js";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount.js";
import { handleAddAddress } from "../store/addressSlice.js";
import { setOrders } from "../store/orderSlice.js";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const user = useSelector((state) => state.user);
  const [refreshingOrders, setRefreshingOrders] = useState(false);
  
  // Function to fetch user orders
  const fetchOrders = async () => {
    try {
      setRefreshingOrders(true);
      const response = await Axios({
        url: SummaryApi.getOrderList.url,
        method: SummaryApi.getOrderList.method
      });
      
      if (response.data.success) {
        dispatch(setOrders(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      // AxiosTostError(error);
    } finally {
      setRefreshingOrders(false);
    }
  };
  
  // Function to fetch all orders (for admin)
  const fetchAllOrders = async () => {
    try {
      setRefreshingOrders(true);
      const response = await Axios({
        url: SummaryApi.getAllOrders.url,
        method: SummaryApi.getAllOrders.method
      });
      
      if (response.data.success) {
        dispatch(setOrders(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching all orders:", error);
      // AxiosTostError(error);
    } finally {
      setRefreshingOrders(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCart,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
        console.log(responseData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: id,
          qty: qty,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        // toast.success(responseData.message)
        fetchCartItems();
        return responseData;
      }
    } catch (error) {
      // AxiosTostError(error);
      return error;
    }
  };
  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItems();
      }
    } catch (error) {
      // AxiosTostError(error);
    }
  };

  // Function to update order status (for both admin and user views)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        url: SummaryApi.updateOrderStatus.url,
        method: SummaryApi.updateOrderStatus.method,
        data: { orderId, orderStatus: newStatus }
      });
      
      if (response.data.success) {
        // Don't show toast here - let the component handle it
        
        // Refresh orders to get the updated status
        if (handleOrder) {
          handleOrder();
        } else {
          // Fallback if handleOrder is not defined yet (due to user being null)
          user?.role?.toUpperCase() === "ADMIN" ? fetchAllOrders() : fetchOrders();
        }
        return true;
      } else {
        // Just log the error but don't show toast as the component will handle it
        console.error("API returned error:", response.data);
        return false;
      }
    } catch (error) {
      // Just log the error but don't show toast as the component will handle it
      console.error("Error updating order status:", error);
      return false;
    }
  };

  const handleOrder = user?.role === "ADMIN" ? fetchAllOrders : fetchOrders;

  const handleLoggout = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  useEffect(() => {
    handleLoggout();
    fetchCartItems();
    fetchAddress();
    handleOrder();
  }, [user]);

  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => {
      return preve + curr.quantity;
    }, 0);
    setTotalQty(qty);

    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = pricewithDiscount(
        curr?.productId?.price,
        curr?.productId?.discount
      );

      return preve + priceAfterDiscount * curr.quantity;
    }, 0);
    setTotalPrice(tPrice);

    const notDiscountTotalPrice = cartItem.reduce((preve, curr) => {
      return preve + curr?.productId?.price * curr.quantity;
    }, 0);
    setNotDiscountTotalPrice(notDiscountTotalPrice);
  }, [cartItem]);


  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }    
    } catch (error) {
      // AxiosTostError(error);
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        handleOrder,
        fetchOrders,
        fetchAllOrders,
        updateOrderStatus,
        refreshingOrders,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
