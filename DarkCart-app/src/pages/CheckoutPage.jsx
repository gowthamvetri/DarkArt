import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import AxiosTostError from "../utils/AxiosTostError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty,fetchCartItems,handleOrder } = useGlobalContext();
  const [OpenAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();
  const handleCashOnDelivery = async () => {
    // Better validation
    if (selectedAddressIndex === null || selectedAddressIndex === undefined || !addressList[selectedAddressIndex]) {
      toast.error("Please select an address");
      return;
    }

    // Get the selected address
    const selectedAddress = addressList[selectedAddressIndex];
    
    // Additional validation
    if (!selectedAddress || !selectedAddress._id) {
      toast.error("Invalid address selected");
      return;
    }
    
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          totalAmount: totalPrice,
          addressId: selectedAddress._id,  // Use the validated address ID
          subTotalAmt: totalPrice,
        },
      })

      const { data: responseData } = response;
      console.log(responseData);
      if(responseData.success) {
        toast.success("Order placed successfully");
        fetchCartItems();
        handleOrder();
        navigate("/success", {
          state: {
            text: "Order"
          }
        })
      }

    } catch (error) {
      AxiosTostError(error)
    }
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 flex flex-col gap-6 w-full lg:flex-row justify-between">
        <div className="w-full">
          <h3 className="text-xl font-bold text-gray-900 font-serif mb-6">Choose your address</h3>

          <div className="space-y-4">
            {addressList.map((address, index) => (
              <label htmlFor={`address-${index}`} key={address._id} className={`${address.status ? "" : "hidden"} cursor-pointer block`}>
                <div
                  key={address._id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 border border-gray-200"
                >
                  <div className="pt-1">
                    <input
                      id={`address-${index}`}
                      type="radio"
                      name="address"
                      value={index}
                      onChange={() => setSelectedAddressIndex(index)}  // Make sure this is onChange, not onClick
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black focus:ring-2"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{address.address_line}</h4>
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                    <p className="text-gray-700 font-medium">Mobile: {address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div
            onClick={() => setOpenAddress(true)}
            className="h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 mt-4"
          >
            <span className="text-gray-600 font-medium">Add address</span>
          </div>
          
        </div>
        <div className="w-full max-w-md bg-white py-6 px-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 font-serif mb-6">Order Summary</h3>
          <div className="bg-white">
            <h4 className="font-semibold text-gray-900 mb-4">Bill details</h4>
            <div className="space-y-3">
              <div className="flex gap-4 justify-between">
                <p className="text-gray-600">Items total</p>
                <p className="flex items-center gap-2">
                  <span className="line-through text-gray-400">
                    {DisplayPriceInRupees(notDiscountTotalPrice)}
                  </span>
                  <span className="font-medium text-black">{DisplayPriceInRupees(totalPrice)}</span>
                </p>
              </div>
              <div className="flex gap-4 justify-between">
                <p className="text-gray-600">Quantity total</p>
                <p className="font-medium text-black">{totalQty} item{totalQty > 1 ? 's' : ''}</p>
              </div>
              <div className="flex gap-4 justify-between">
                <p className="text-gray-600">Delivery Charge</p>
                <p className="font-medium text-black">Free</p>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-4">
                <div className="font-bold flex items-center justify-between gap-4 text-lg">
                  <p className="text-gray-900">Grand total</p>
                  <p className="text-black">{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3 mt-6">
            <button className="bg-black px-6 py-3 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors tracking-wide">
              Online Payment
            </button>
            <button onClick={handleCashOnDelivery} className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors">
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {OpenAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
