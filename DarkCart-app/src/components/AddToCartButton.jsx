import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi.js";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTostError.js";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddToCartButton = ({ data }) => {
  const { fetchCartItems, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  // console.log("cartItem",cartItem)
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState();
  const navigate = useNavigate();

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItems) {
          fetchCartItems();
        }
      }
    } catch (error) {
      toast.error("Please login to add items to cart");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  //checking this item in cart or not
  useEffect(() => {
    const checkingitem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    setIsAvailableCart(checkingitem);

    const product = cartItem.find((item) => item.productId._id === data._id);
    setQty(product?.quantity);
    setCartItemsDetails(product);
  }, [data, cartItem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await updateCartItem(cartItemDetails?._id, qty + 1);

    if (response.success) {
      toast.success("Item added");
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (qty <= 1) {
      const response = await deleteCartItem(cartItemDetails?._id);
      if (response.success) {
        toast.success("Item removed");
      }
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);
      if (response.success) {
        toast.success("Quantity decreased");
      }
    }
  };
  
  return (
    <div className="w-full max-w-[150px] ">
      {isAvailableCart ? (
        <div className="flex w-full h-full border border-gray-300 rounded-md overflow-hidden bg-white">
          <button
            onClick={decreaseQty}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 flex-1 w-full p-2 flex items-center justify-center transition-colors border-r border-gray-200"
          >
            <FaMinus size={12} />
          </button>

          <div className="flex-1 w-full font-semibold px-1 flex items-center justify-center text-gray-900 bg-gray-50 min-w-[40px]">
            {qty}
          </div>

          <button
            onClick={increaseQty}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 flex-1 w-full p-2 flex items-center justify-center transition-colors border-l border-gray-200"
          >
            <FaPlus size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          disabled={loading}
          className="bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 lg:px-4 lg:py-2 rounded-md transition-colors font-medium tracking-wide flex items-center justify-center gap-1 lg:gap-2 w-full"
        >
          {loading ? (
            <Loading />
          ) : (
            <>
              <FaShoppingBag size={14} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
