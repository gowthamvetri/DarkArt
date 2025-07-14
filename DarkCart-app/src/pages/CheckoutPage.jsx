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

  // Delivery charge calculation states
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [deliveryDistance, setDeliveryDistance] = useState(null);

  const GEOCODING_API_KEY = "038cafabde4449718e8dc2303a78956f";
  const SHOP_LOCATION = "Tirupur"; // Your shop location (simplified like test.jsx)

  // Function to extract and normalize city/district names for consistent comparison
  const extractAndNormalizeCity = (address) => {
    if (!address || !address.city) return null;
    
    let cityName = address.city.toString().trim();
    console.log(`Raw city name from address: "${cityName}"`);
    
    // Convert to lowercase for processing
    let normalized = cityName.toLowerCase();
    console.log(`Lowercase city: "${normalized}"`);
    
    // Remove common administrative suffixes that refer to the same place
    normalized = normalized
      .replace(/\s+district$/i, '') // Remove "district" suffix
      .replace(/\s+taluk$/i, '')    // Remove "taluk" suffix  
      .replace(/\s+taluka$/i, '')   // Remove "taluka" suffix
      .replace(/\s+city$/i, '')     // Remove "city" suffix
      .replace(/\s+municipality$/i, '') // Remove "municipality" suffix
      .replace(/\s+corporation$/i, '') // Remove "corporation" suffix
      .replace(/\s+rural$/i, '')    // Remove "rural" suffix
      .replace(/\s+urban$/i, '')    // Remove "urban" suffix
      .trim();
    
    console.log(`After suffix removal: "${normalized}"`);
    
    // Handle common variations
    const cityMappings = {
      'tirupur': 'tirupur',
      'thirupur': 'tirupur',
      'tirpur': 'tirupur',
      'tiruppur': 'tirupur', // Add this mapping for the double 'p' variation
      'coimbatore': 'coimbatore',
      'kovai': 'coimbatore',
      'chennai': 'chennai',
      'madras': 'chennai',
      'bangalore': 'bangalore',
      'bengaluru': 'bangalore'
    };
    
    // Apply city mappings
    if (cityMappings[normalized]) {
      normalized = cityMappings[normalized];
      console.log(`After city mapping: "${normalized}"`);
    }
    
    // Capitalize first letter of each word for display
    const result = normalized.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    console.log(`Final normalized result: "${result}"`);
    return result;
  };

  console.log(cartItemsList)

  // Delivery charge calculation functions (updated from test.jsx logic)
  const getCoordinates = async (address) => {
    try {
      // Use OpenCage Geocoding API with your API key (same as test.jsx)
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address + ', India')}&key=${GEOCODING_API_KEY}&limit=1&countrycode=in&language=en`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.lat,
          lon: result.geometry.lng,
          display_name: result.formatted,
          confidence: result.confidence
        };
      } else {
        throw new Error(`Location not found: ${address}`);
      }
    } catch (err) {
      // Fallback to Nominatim if OpenCage fails
      console.warn("OpenCage geocoding failed, using Nominatim fallback:", err.message);
      const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, India&limit=1&countrycodes=in&addressdetails=1`;
      const response = await fetch(fallbackUrl);
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name,
          confidence: 5 // Lower confidence for fallback
        };
      } else {
        throw new Error(`Location not found: ${address}`);
      }
    }
  };

  const getStraightLineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getRoadDistance = async (fromLocation, toLocation) => {
    try {
      // Get coordinates using your geocoding API
      const fromCoords = await getCoordinates(fromLocation);
      const toCoords = await getCoordinates(toLocation);

      // Method 1: Use OSRM (Open Source Routing Machine) - most accurate
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false&alternatives=false&steps=false`;
      
      try {
        const response = await fetch(osrmUrl);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const distanceInMeters = data.routes[0].distance;
          return distanceInMeters / 1000; // Convert to kilometers
        }
      } catch (err) {
        console.log("OSRM failed, trying GraphHopper...");
      }

      // Method 2: Try GraphHopper API as fallback
      const graphHopperUrl = `https://graphhopper.com/api/1/route?point=${fromCoords.lat},${fromCoords.lon}&point=${toCoords.lat},${toCoords.lon}&vehicle=car&locale=en&calc_points=false&key=`;
      
      try {
        const response = await fetch(graphHopperUrl);
        const data = await response.json();
        
        if (data.paths && data.paths.length > 0) {
          const distanceInMeters = data.paths[0].distance;
          return distanceInMeters / 1000; // Convert to kilometers
        }
      } catch (err) {
        console.log("GraphHopper failed, using fallback calculation...");
      }

      // Method 3: Fallback with adjusted straight-line distance
      const straightDistance = getStraightLineDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
      // Apply a road factor of 1.4 to approximate road distance from straight-line
      return straightDistance * 1.4;
      
    } catch (err) {
      throw new Error(`Unable to calculate distance: ${err.message}`);
    }
  };

  // Enhanced delivery charge calculation based on road distance (₹50 for every 80km)
  const getDeliveryChargeFromDistance = (distance) => {
    // Calculate charge: ₹50 for every 80km (or part thereof)
    const chargePerSegment = 50; // ₹50
    const kmPerSegment = 80; // per 80km
    
    // Calculate how many 80km segments (round up for partial segments)
    const segments = Math.ceil(distance / kmPerSegment);
    
    return segments * chargePerSegment;
  };

  const calculateDeliveryCharge = async (customerAddress) => {
    if (!customerAddress) {
      setDeliveryCharge(0);
      setDeliveryDistance(null);
      return;
    }

    setIsCalculatingDelivery(true);
    
    try {
      // Extract and normalize the customer city/district name
      const normalizedCustomerCity = extractAndNormalizeCity(customerAddress);
      
      if (!normalizedCustomerCity) {
        throw new Error("Unable to extract city from address");
      }
      
      console.log(`Extracted city: "${normalizedCustomerCity}" from address:`, customerAddress);
      
      // Early return for same city (exactly like test.jsx logic)
      // Check both normalized names before any API calls
      const shopCity = 'tirupur';
      const customerCity = normalizedCustomerCity.toLowerCase();
      
      console.log(`Comparing: "${shopCity}" vs "${customerCity}"`);
      console.log(`Are they equal? ${customerCity === shopCity}`);
      
      if (customerCity === shopCity) {
        console.log("✅ Same city delivery detected - charging ₹50 for local delivery");
        setDeliveryDistance('0');
        setDeliveryCharge(50); // ₹50 for same place delivery
        return; // Exit early, don't call getRoadDistance
      }
      
      // Only call API if cities are different (same as test.jsx)
      console.log("Different cities - calculating road distance");
      const roadDistance = await getRoadDistance(SHOP_LOCATION, normalizedCustomerCity);
      const deliveryCharge = getDeliveryChargeFromDistance(roadDistance);
      
      setDeliveryDistance(roadDistance.toFixed(2));
      setDeliveryCharge(deliveryCharge);
      
    } catch (error) {
      console.error("Error calculating delivery charge:", error);
      setDeliveryCharge(0); // Default to free delivery if calculation fails
      setDeliveryDistance(null);
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  // Calculate delivery charge when address is selected
  useEffect(() => {
    if (selectedAddressIndex !== null && addressList[selectedAddressIndex]) {
      calculateDeliveryCharge(addressList[selectedAddressIndex]);
    } else {
      setDeliveryCharge(0);
      setDeliveryDistance(null);
    }
  }, [selectedAddressIndex, addressList]);

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
          totalAmount: totalPrice + deliveryCharge, // Include delivery charge in total
          addressId: selectedAddress._id,
          subTotalAmt: totalPrice,
          deliveryCharge: deliveryCharge, // Add delivery charge to order data
          quantity: totalQty,
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your order in just a few steps</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-2">1</div>
                <span className="font-medium">Delivery Address</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-2">2</div>
                <span>Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Address Selection Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Address Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Delivery Address</h2>
                    <p className="text-gray-300 mt-1">Choose where you'd like your order delivered</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Address List */}
              <div className="p-8">
                <div className="space-y-4">
                  {addressList.map((address, index) => (
                    <label 
                      htmlFor={`address-${index}`} 
                      key={address._id} 
                      className={`${address.status ? "" : "hidden"} cursor-pointer block group`}
                    >
                      <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                        selectedAddressIndex === index 
                          ? 'border-black bg-gray-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}>
                        {/* Selection Indicator */}
                        {selectedAddressIndex === index && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black to-gray-800"></div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-start space-x-4">
                            {/* Radio Button */}
                            <div className="flex-shrink-0 pt-1">
                              <input
                                id={`address-${index}`}
                                type="radio"
                                name="address"
                                value={index}
                                checked={selectedAddressIndex === index}
                                onChange={() => setSelectedAddressIndex(index)}
                                className="w-5 h-5 text-black focus:ring-black focus:ring-2 border-gray-300"
                              />
                            </div>

                            {/* Address Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                                    {address.address_line}
                                  </h3>
                                  <div className="space-y-1 text-gray-600">
                                    <p className="flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      </svg>
                                      {address.city}, {address.state} - {address.pincode}
                                    </p>
                                    <p className="flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                      </svg>
                                      {address.country}
                                    </p>
                                    <p className="flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      {address.mobile}
                                    </p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2 ml-4">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleEditAddress(address);
                                    }}
                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    title="Edit Address"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteAddress(address._id);
                                    }}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                    title="Delete Address"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}

                  {/* Add New Address Card */}
                  <div 
                    onClick={() => setOpenAddress(true)}
                    className="group cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors mb-4">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Address</h3>
                      <p className="text-gray-600">Add a new delivery address to your account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Summary Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Summary
                  </h3>
                </div>

                <div className="p-6">
                  {/* Bill Details */}
                  <div className="space-y-4 mb-6">
                    {/* Items Total */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="text-gray-700 font-medium">Items total</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-gray-400 text-sm">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                          <span className="font-bold text-gray-900">{DisplayPriceInRupees(totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-gray-700 font-medium">Quantity</span>
                      </div>
                      <span className="font-bold text-gray-900">{totalQty} item{totalQty > 1 ? 's' : ''}</span>
                    </div>

                    {/* Delivery Charge */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
                        </svg>
                        <span className="text-gray-700 font-medium">Delivery Charge</span>
                      </div>
                      <div className="text-right">
                        {isCalculatingDelivery ? (
                          <div className="flex items-center space-x-2">
                            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm text-gray-500">Calculating...</span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="font-bold text-gray-900">{DisplayPriceInRupees(deliveryCharge)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Grand Total</span>
                      <span className="text-2xl font-bold text-black">{DisplayPriceInRupees(totalPrice + deliveryCharge)}</span>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center group">
                      <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Pay Online
                    </button>
                    
                    <button
                      onClick={handleCashOnDelivery}
                      disabled={isProcessing}
                      className={`w-full border-2 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group relative overflow-hidden ${
                        isProcessing 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-black hover:text-black hover:shadow-lg'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Cash on Delivery
                        </>
                      )}
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure & Encrypted Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
    </div>
  );
};

export default CheckoutPage;
