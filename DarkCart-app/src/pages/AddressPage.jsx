import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import AxiosTostError from "../utils/AxiosTostError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import noCart from "../assets/noCart.jpg"; // Import fallback image
import toast from "react-hot-toast";
import EditAddressData from "../components/EditAddressData";
import Logo from "../assets/logo.png";
import ErrorBoundary from "../components/ErrorBoundary";

// Helper function to safely access product properties
const getProductProperty = (item, propertyPath, fallback = "") => {
  try {
    if (!item) return fallback;
    
    // Handle different potential structures
    const paths = [
      // If product is directly on the item
      `product.${propertyPath}`,
      // If product is in productId field
      `productId.${propertyPath}`,
      // Direct property on the item
      propertyPath
    ];
    
    for (const path of paths) {
      const value = path.split('.').reduce((obj, key) => {
        // Handle array index notation like "image[0]"
        if (key.includes('[') && key.includes(']')) {
          const arrayKey = key.substring(0, key.indexOf('['));
          const indexMatch = key.match(/\[(\d+)\]/);
          if (indexMatch && obj && obj[arrayKey] && Array.isArray(obj[arrayKey])) {
            const index = parseInt(indexMatch[1]);
            return obj[arrayKey][index];
          }
          return undefined;
        }
        return obj && obj[key] !== undefined ? obj[key] : undefined;
      }, item);
      
      if (value !== undefined) return value;
    }
    
    return fallback;
  } catch (error) {
    console.log(`Error accessing ${propertyPath}:`, error);
    return fallback;
  }
};

// Function to calculate item pricing consistently (similar to CheckoutPage)
const calculateItemPricing = (item) => {
  let productTitle = 'Item';
  let originalPrice = 0;
  let finalPrice = 0;
  let discount = 0;
  let isBundle = false;
  let quantity = item.quantity || 1;
  
  if (item.productId && item.productId._id) {
    // It's a product - discount applies
    productTitle = item.productId.name || 'Product';
    originalPrice = item.productId.price || 0;
    discount = item.productId.discount || 0;
    finalPrice = discount > 0 ? originalPrice * (1 - discount/100) : originalPrice;
    isBundle = false;
  } else if (item.bundleId && item.bundleId._id) {
    // It's a bundle - NO DISCOUNT
    productTitle = item.bundleId.title || 'Bundle';
    originalPrice = item.bundleId.originalPrice || 0;
    finalPrice = item.bundleId.bundlePrice || 0;
    discount = 0; // Force discount to 0 for bundles
    isBundle = true;
  } else {
    // Fallback: check if item itself has properties
    productTitle = item.title || item.name || 'Item';
    
    // Check if it's a bundle based on field names
    if (item.bundlePrice || item.title) {
      isBundle = true;
      originalPrice = item.originalPrice || 0;
      finalPrice = item.bundlePrice || item.price || 0;
      discount = 0;
    } else {
      isBundle = false;
      originalPrice = item.price || 0;
      discount = item.discount || 0;
      finalPrice = discount > 0 ? originalPrice * (1 - discount/100) : originalPrice;
    }
  }
  
  return {
    productTitle,
    originalPrice,
    finalPrice,
    discount,
    isBundle,
    quantity,
    totalPrice: finalPrice * quantity,
    totalOriginalPrice: originalPrice * quantity
  };
};

const AddressPage = () => {
  const { fetchCartItems, handleOrder, fetchAddress } = useGlobalContext();
  const [openAddAddress, setOpenAddAddress] = useState(false);
  
  // Get addresses from Redux store
  const reduxAddressList = useSelector((state) => state.addresses.addressList);
  
  // Create a local copy for immediate UI updates
  const [localAddressList, setLocalAddressList] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  // Get selected items from sessionStorage (set in BagPage)
  const [selectedCartItemIds, setSelectedCartItemIds] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    const selectedIds = JSON.parse(sessionStorage.getItem('selectedCartItems') || '[]');
    setSelectedCartItemIds(selectedIds);
    
    // Filter cart items to only include selected ones
    const itemsToCheckout = cartItemsList.filter(item => selectedIds.includes(item._id));
    setCheckoutItems(itemsToCheckout);
  }, [cartItemsList]);
  
  // Function to calculate item pricing consistently
  const calculateItemPricing = (item) => {
    let productTitle = 'Item';
    let originalPrice = 0;
    let finalPrice = 0;
    let discount = 0;
    let isBundle = false;
    let quantity = item.quantity || 1;
    
    if (item.productId && item.productId._id) {
      productTitle = item.productId.name || 'Product';
      originalPrice = item.productId.price || 0;
      discount = item.productId.discount || 0;
      finalPrice = discount > 0 ? originalPrice * (1 - discount/100) : originalPrice;
      isBundle = false;
    } else if (item.bundleId && item.bundleId._id) {
      productTitle = item.bundleId.title || 'Bundle';
      originalPrice = item.bundleId.originalPrice || 0;
      finalPrice = item.bundleId.bundlePrice || 0;
      discount = 0;
      isBundle = true;
    } else {
      productTitle = item.title || item.name || 'Item';
      
      if (item.bundlePrice || item.title) {
        isBundle = true;
        originalPrice = item.originalPrice || 0;
        finalPrice = item.bundlePrice || item.price || 0;
        discount = 0;
      } else {
        isBundle = false;
        originalPrice = item.price || 0;
        discount = item.discount || 0;
        finalPrice = discount > 0 ? originalPrice * (1 - discount/100) : originalPrice;
      }
    }
    
    return {
      productTitle,
      originalPrice,
      finalPrice,
      discount,
      isBundle,
      quantity,
      totalPrice: finalPrice * quantity,
      totalOriginalPrice: originalPrice * quantity
    };
  };

  // Calculate totals for selected items only
  const selectedTotals = checkoutItems.reduce((totals, item) => {
    const pricing = calculateItemPricing(item);
    return {
      totalQty: totals.totalQty + pricing.quantity,
      totalPrice: totals.totalPrice + pricing.totalPrice,
      totalOriginalPrice: totals.totalOriginalPrice + pricing.totalOriginalPrice
    };
  }, { totalQty: 0, totalPrice: 0, totalOriginalPrice: 0 });

  // Extract values for easier use in JSX
  const totalQty = selectedTotals.totalQty;
  const totalPrice = selectedTotals.totalPrice;
  const notDiscountTotalPrice = selectedTotals.totalOriginalPrice;

  // Keep local address list in sync with Redux
  useEffect(() => {
    setLocalAddressList(reduxAddressList);
  }, [reduxAddressList]);
  
  // Use the local address list for rendering
  const addressList = localAddressList;

  // State for edit address functionality
  const [editAddressData, setEditAddressData] = useState(null);
  const [openEditAddress, setOpenEditAddress] = useState(false);

  // Delivery charge calculation states
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [deliveryDistance, setDeliveryDistance] = useState(null);

  // Add state for estimated delivery dates
  const [deliveryDates, setDeliveryDates] = useState([]);

  const GEOCODING_API_KEY = "038cafabde4449718e8dc2303a78956f";
  const SHOP_LOCATION = "Tirupur"; // Your shop location (simplified like test.jsx)

  // Function to extract and normalize city/district names for consistent comparison
  const extractAndNormalizeCity = (address) => {
    if (!address || !address.city) return null;
    
    let cityName = address.city.toString().trim();
    
    // Convert to lowercase for processing
    let normalized = cityName.toLowerCase();
    
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
    
    // Handle common variations
    const cityMappings = {
      'tirupur': 'tirupur',
      'thirupur': 'tirupur',
      'tirpur': 'tirupur',
      'tiruppur': 'tirupur',
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
    }
    
    // Capitalize first letter of each word for display
    const result = normalized.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return result;
  };

  // Delivery charge calculation functions
  const getCoordinates = async (address) => {
    try {
      // Use OpenCage Geocoding API with your API key
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
      
      // Early return for same city
      const shopCity = 'tirupur';
      const customerCity = normalizedCustomerCity.toLowerCase();
      
      if (customerCity === shopCity) {
        setDeliveryDistance('0');
        setDeliveryCharge(50); // ₹50 for same place delivery
        return;
      }
      
      // Only call API if cities are different
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

  // Handle address list changes
  useEffect(() => {
    // If there are no addresses, reset the selected index
    if (!addressList || addressList.length === 0) {
      setSelectedAddressIndex(null);
      setDeliveryCharge(0);
      setDeliveryDistance(null);
      return;
    }
    
    // If the selected index is no longer valid after an update, reset it
    if (selectedAddressIndex !== null && selectedAddressIndex >= addressList.length) {
      setSelectedAddressIndex(null);
    }
  }, [addressList]);
  
  // Calculate delivery charge when address is selected
  useEffect(() => {
    // If selected index is null or invalid, reset values
    if (selectedAddressIndex === null || !addressList || !addressList[selectedAddressIndex]) {
      setDeliveryCharge(0);
      setDeliveryDistance(null);
      return;
    }
    
    // Calculate delivery charge for the selected address
    calculateDeliveryCharge(addressList[selectedAddressIndex]);
  }, [selectedAddressIndex, addressList]);
  
  // Fetch addresses when component mounts
  useEffect(() => {
    // Initial fetch
    fetchAddress();
  }, []);
  
  // Debug logging for edit address modal
  useEffect(() => {
    console.log("Edit address modal state:", { 
      open: openEditAddress, 
      data: editAddressData 
    });
  }, [openEditAddress, editAddressData]);

  const handleDeleteAddress = async (addressId) => {
    try {
      console.log("Deleting address with ID:", addressId);
      
      // Handle the selected index before making the API call
      const addressToDeleteIndex = addressList.findIndex(addr => addr._id === addressId);
      if (selectedAddressIndex !== null) {
        if (addressToDeleteIndex === selectedAddressIndex) {
          // If the deleted address was selected, clear the selection
          setSelectedAddressIndex(null);
        } else if (addressToDeleteIndex < selectedAddressIndex) {
          // If an address before the selected one was deleted, adjust the index
          setSelectedAddressIndex(selectedAddressIndex - 1);
        }
      }
      
      // Immediately update local state to reflect the deletion
      setLocalAddressList(prevList => prevList.filter(addr => addr._id !== addressId));
      
      // Simple implementation similar to Address.jsx
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data: { _id: addressId },
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Fetch fresh address data
        fetchAddress();
      } else {
        toast.error("Failed to delete address");
        fetchAddress(); // Refresh to restore state if failed
      }
    } catch (error) {
      console.error("Error in handleDeleteAddress:", error);
      AxiosTostError(error);
      fetchAddress(); // Refresh to restore state on error
    }
  };

  // Function to handle editing an address
  const handleEditAddress = (address) => {
    console.log("Setting edit address data:", address);
    // Make a deep copy to prevent any reference issues
    setEditAddressData({...address});
    setOpenEditAddress(true);
  };

  // Calculate estimated delivery dates for products
  useEffect(() => {
    try {
      if (checkoutItems && checkoutItems.length > 0) {
        // Calculate delivery dates (current date + 3-5 days)
        const today = new Date();
        const deliveryEstimates = checkoutItems.map((item, idx) => {
          // Random delivery estimate between 3-7 days
          const deliveryDays = Math.floor(Math.random() * 5) + 3;
          const deliveryDate = new Date(today);
          deliveryDate.setDate(today.getDate() + deliveryDays);
          
          // Get a unique ID for each item
          const itemId = item?._id || 
                        item?.productId?._id || 
                        `temp-${idx}-${Math.random().toString(36).substr(2, 9)}`;
          
          return {
            productId: itemId,
            deliveryDate: deliveryDate,
            formattedDate: `${deliveryDate.getDate()} ${deliveryDate.toLocaleString('default', { month: 'short' })} ${deliveryDate.getFullYear()}`
          };
        });
        
        setDeliveryDates(deliveryEstimates);
      } else {
        // Reset delivery dates if no items
        setDeliveryDates([]);
      }
    } catch (error) {
      console.error("Error calculating delivery dates:", error);
      
      // Set fallback dates in case of error
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 5); // Default 5-day delivery
      
      const fallbackEstimates = Array(checkoutItems?.length || 0).fill().map((_, i) => ({
        productId: `fallback-${i}`,
        deliveryDate: fallbackDate,
        formattedDate: `${fallbackDate.getDate()} ${fallbackDate.toLocaleString('default', { month: 'short' })} ${fallbackDate.getFullYear()}`
      }));
      
      setDeliveryDates(fallbackEstimates);
    }
  }, [checkoutItems]);

  const handleContinueToPayment = () => {
    // Check if there's a valid selected address
    if (selectedAddressIndex === null) {
      toast.error("Please select an address");
      return;
    }
    
    // Verify that the selected address exists in the address list
    if (!addressList || !addressList[selectedAddressIndex]) {
      toast.error("Selected address is no longer available. Please select another address.");
      setSelectedAddressIndex(null);
      return;
    }
    
    // Continue to payment with the selected address
    navigate('/checkout/payment', { 
      state: { 
        selectedAddressId: addressList[selectedAddressIndex]._id,
        deliveryCharge 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with stepper */}
      <div className="bg-black shadow-sm border-b text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-24">
              <Link to="/">
                <img src={Logo} alt="DarkCart Logo" className="h-10" />
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs uppercase tracking-wide text-gray-300">
                <Link to="/checkout/bag" className="hover:text-white">BAG</Link>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="text-xs uppercase tracking-wide text-teal-400 font-medium">ADDRESS</div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="text-xs uppercase tracking-wide text-gray-300">
                <span className="cursor-not-allowed">PAYMENT</span>
              </div>
            </div>
            <div className="w-24">
              {/* Placeholder for balance */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Address Section */}
          <div className="lg:col-span-2">
            {/* Address Selection Section */}
            <div className="bg-white rounded shadow mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Select Delivery Address</h2>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-700 font-medium">DEFAULT ADDRESS</p>
                </div>
                
                <div className="space-y-4">
                  {addressList.filter(address => address.status).map((address, index) => (
                    <div 
                      key={address._id}
                      className={`relative border rounded p-4 ${
                        selectedAddressIndex === index ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <input
                            id={`address-${index}`}
                            type="radio"
                            name="address"
                            value={index}
                            checked={selectedAddressIndex === index}
                            onChange={() => setSelectedAddressIndex(index)}
                            className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{address.address_line}</span>
                            {address.addressType === 'HOME' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                                HOME
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mt-1">
                            {address.city}, {address.state} - {address.pincode}
                          </div>
                          
                          <div className="text-sm text-gray-600 mt-1">
                            Mobile: {address.mobile}
                          </div>
                          
                          <div className="mt-3 space-x-4">
                            <button
                              onClick={() => {
                                console.log("Edit button clicked for address:", address);
                                handleEditAddress({...address});  // Pass a deep copy of the address
                              }}
                              className="text-sm text-teal-600 font-medium border border-teal-300 rounded-md px-4 py-1 hover:bg-teal-50"
                            >
                              EDIT
                            </button>
                            
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              type="button"
                              className="text-sm text-gray-700 font-medium border rounded-md px-4 py-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {selectedAddressIndex === index && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">
                            • Pay on Delivery available
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add New Address Button */}
                  <div 
                    onClick={() => setOpenAddAddress(true)}
                    className="flex items-center justify-center p-4 border border-dashed border-teal-300 rounded cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-teal-500 mb-1 text-xl">+</div>
                      <div className="text-sm font-medium text-teal-700">Add New Address</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Display Section with Delivery Estimates */}
            <div className="bg-white rounded shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">DELIVERY ESTIMATES</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {checkoutItems.map((item, index) => {
                    // Use our safe access helper to get all needed properties
                    const itemId = getProductProperty(item, '_id', `item-${index}`);
                    const deliveryInfo = deliveryDates.find(d => d.productId === itemId);
                    
                    // Get image source safely
                    const imageSrc = getProductProperty(item, 'image[0]') || 
                                    getProductProperty(item, 'primaryImage') ||
                                    noCart; // Use local fallback image
                    
                    // Get product title/name safely
                    const productTitle = getProductProperty(item, 'name', 'Product') || 
                                        getProductProperty(item, 'title', 'Product');
                    const size = getProductProperty(item, 'size', 'Standard');
                    const quantity = getProductProperty(item, 'quantity', 1);
                    
                    return (
                      <div key={`checkout-item-${itemId}-${index}`} className="flex border-b last:border-b-0 py-4">
                        <div className="w-20 h-24 flex-shrink-0">
                          <img 
                            src={imageSrc} 
                            alt={productTitle}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = noCart; // Use local fallback image
                            }}
                          />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{productTitle}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Size: {size} • Qty: {quantity}
                          </p>
                          
                          <div className="flex items-center mt-3">
                            <div className="text-sm">
                              <span className="text-gray-700 font-medium">
                                Estimated delivery by {
                                  deliveryInfo?.formattedDate || 'Next Week'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1">
            {/* Product Images with Details */}
            <div className="bg-white rounded shadow mb-4">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Your Items ({totalQty})</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {checkoutItems.map((item, index) => {
                    // Use our safe access helper to get all needed properties
                    const itemId = getProductProperty(item, '_id', `item-${index}`);
                    const deliveryInfo = deliveryDates.find(d => d.productId === itemId);
                    const pricing = calculateItemPricing(item); // Use consistent pricing function
                    
                    // Get image source safely - handle both products and bundles
                    let imageSrc = noCart;
                    if (item.productId && item.productId._id) {
                      imageSrc = item.productId.image?.[0] || item.productId.primaryImage || noCart;
                    } else if (item.bundleId && item.bundleId._id) {
                      imageSrc = item.bundleId.images?.[0] || item.bundleId.image || noCart;
                    } else {
                      imageSrc = item.image?.[0] || item.images?.[0] || item.primaryImage || item.image || noCart;
                    }
                    
                    const size = getProductProperty(item, 'size', 'Standard');
                    
                    return (
                      <div 
                        key={`preview-item-${index}`} 
                        className="flex items-start border-b pb-3 last:border-b-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-50 border border-gray-200 rounded overflow-hidden">
                          <img 
                            src={imageSrc}
                            alt={pricing.productTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = noCart;
                            }}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium line-clamp-1" title={pricing.productTitle}>
                            {pricing.productTitle}
                            {pricing.isBundle && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Bundle
                              </span>
                            )}
                          </h3>
                          
                          <div className="flex flex-wrap text-xs text-gray-500 mt-1">
                            <span className="mr-2">Size: {size}</span>
                            <span>Qty: {pricing.quantity}</span>
                          </div>
                          
                          <div className="mt-1 flex items-center">
                            <span className="font-medium text-sm">
                              {DisplayPriceInRupees(pricing.totalPrice)}
                            </span>
                            {/* Only show discount for products, not bundles */}
                            {!pricing.isBundle && pricing.discount > 0 && (
                              <>
                                <span className="mx-1 text-xs line-through text-gray-400">
                                  {DisplayPriceInRupees(pricing.totalOriginalPrice)}
                                </span>
                                <span className="text-xs text-green-600">
                                  {pricing.discount}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="mt-1">
                            <span className="text-xs text-teal-600 font-medium">
                              Delivery by {deliveryInfo?.formattedDate || 'Next Week'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Price Details */}
            <div className="bg-white rounded shadow sticky top-4">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">PRICE DETAILS ({totalQty} {totalQty === 1 ? 'Item' : 'Items'})</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total MRP</span>
                    <span>₹{notDiscountTotalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Discount on MRP</span>
                    <span className="text-green-600">-₹{(notDiscountTotalPrice - totalPrice).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Platform Fee</span>
                    <div className="flex items-center">
                      <span className="line-through text-gray-500 mr-1">₹99</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Delivery Charge</span>
                    {isCalculatingDelivery ? (
                      <span className="text-gray-500">Calculating...</span>
                    ) : (
                      <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}</span>
                    )}
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>₹{(totalPrice + deliveryCharge).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleContinueToPayment}
                  disabled={selectedAddressIndex === null}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 mt-6 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed border-b-4 border-teal-500"
                >
                  CONTINUE
                </button>
                
                <div className="mt-6 text-xs text-center text-gray-600">
                  <p>Safe and Secure Payments. Easy returns.</p>
                  <p>100% Authentic products.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {openAddAddress && <AddAddress close={() => setOpenAddAddress(false)} />}
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

// Wrap with ErrorBoundary for better error handling
const AddressPageWithErrorBoundary = () => (
  <ErrorBoundary>
    <AddressPage />
  </ErrorBoundary>
);

export default AddressPageWithErrorBoundary;
