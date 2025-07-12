import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import AxiosTostError from "../utils/AxiosTostError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EditAddressData from "../components/EditAddressData";

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItems, handleOrder, fetchAddress } = useGlobalContext();
  const [OpenAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  // State for edit address functionality
  const [editAddressData, setEditAddressData] = useState(null);
  const [openEditAddress, setOpenEditAddress] = useState(false);

  // Add state for countries, states, cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: { _id: addressId },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success("Address deleted successfully");
        fetchAddress(); // Refresh the address list
        // Reset selected address index if the deleted address was selected
        if (selectedAddressIndex !== null && addressList[selectedAddressIndex]?._id === addressId) {
          setSelectedAddressIndex(null);
        }
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCashOnDelivery = async () => {
    // Better validation
    if (selectedAddressIndex === null || selectedAddressIndex === undefined || !addressList[selectedAddressIndex]) {
      toast.error("Please select an address");
      return;
    }

    // Get the selected address
    const selectedAddress = addressList[selectedAddressIndex];

    // Ensure the selected address is valid
    if (!addressList || addressList.length === 0) {
      toast.error("No addresses available");
      return;
    }

    // Additional validation
    if (!selectedAddress || !selectedAddress._id) {
      toast.error("Invalid address selected");
      return;
    }

    setIsProcessing(true);

    try {
      // Show a loading toast
      toast.loading("Processing your order...", {
        id: "order-processing",
      });

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          totalAmount: totalPrice,
          addressId: selectedAddress._id, // Use the validated address ID
          subTotalAmt: totalPrice,
          quantity: totalQty, // Ensure quantity is passed correctly
        },
      });

      const { data: responseData } = response;
      console.log(responseData);

      // Dismiss the loading toast
      toast.dismiss("order-processing");

      if (responseData.success) {
        toast.success("Order placed successfully");
        fetchCartItems();
        handleOrder();
        navigate("/order-success", {
          state: {
            text: "Order",
          },
        });
      }
    } catch (error) {
      toast.dismiss("order-processing");
      AxiosTostError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add functions to fetch countries, states and cities
  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setCountries(data.data.map((c) => ({ name: c.name, code: c.iso2 || "" })));
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchStates = async (country) => {
    if (!country) return;

    setIsLoadingStates(true);
    setStates([]);
    setCities([]);

    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });

      const data = await response.json();
      if (data.data && data.data.states) {
        setStates(data.data.states);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const fetchCities = async (country, state) => {
    if (!country || !state) return;

    setIsLoadingCities(true);
    setCities([]);

    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state }),
      });

      const data = await response.json();
      if (data.data) {
        setCities(data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Function to handle editing an address
  const handleEditAddress = (address) => {
    setEditAddressData(address);
    setOpenEditAddress(true);
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    try {
      const orderData = {
        list_items: cartItem.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
        addressId: selectedAddress._id,
        subTotalAmt: notDiscountTotalPrice,
      };

      const response = await Axios({
        ...SummaryApi.cashOnDelivery,
        data: orderData,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Redirect to success page
        navigate("/order-success");
      }
    } catch (error) {
      if (error.response?.data?.productId) {
        // Handle specific stock error
        const errorData = error.response.data;
        toast.error(
          `${errorData.message}\nPlease update your cart and try again.`
        );
        // Optionally refresh cart to show updated stock
        fetchCartItems();
      } else {
        toast.error(error.response?.data?.message || "Order failed");
      }
    } finally {
      setLoading(false);
    }
  };

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
                      onChange={() => setSelectedAddressIndex(index)} // Make sure this is onChange, not onClick
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black focus:ring-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{address.address_line}</h4>
                    <p className="text-gray-600">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                    <p className="text-gray-700 font-medium">Mobile: {address.mobile}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent radio button selection
                        handleDeleteAddress(address._id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent radio button selection
                        handleEditAddress(address);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200 text-sm"
                    >
                      Edit
                    </button>
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
                  <span className="line-through text-gray-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
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
            <button className="bg-black px-6 py-3 text-white font-semibold rounded-md hover:bg-gray-800 transition-all duration-300 tracking-wide transform hover:-translate-y-1 hover:shadow-lg">
              Online Payment
            </button>
            <button
              onClick={handleCashOnDelivery}
              disabled={isProcessing}
              className={`px-6 py-3 border-2 ${isProcessing ? 'bg-gray-100 border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transform hover:-translate-y-1'} font-semibold rounded-md transition-all duration-300 hover:shadow-md relative overflow-hidden group`}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Cash on Delivery"}
              </span>
              <span className={`absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 transform scale-x-0 ${!isProcessing ? 'group-hover:scale-x-100' : ''} transition-transform origin-left duration-300`}></span>
            </button>
          </div>
        </div>
      </div>

      {OpenAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEditAddress && editAddressData && (
        <EditAddressData
          close={() => {
            setOpenEditAddress(false);
            setEditAddressData(null);
          }}
          data={editAddressData}
        />
      )}
    </section>
  );
};

export default CheckoutPage;
