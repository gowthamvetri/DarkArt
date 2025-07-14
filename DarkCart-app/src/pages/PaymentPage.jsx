import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosTostError from "../utils/AxiosTostError";
import Logo from "../assets/logo.png";
import ErrorBoundary from "../components/ErrorBoundary";

// Import payment icons
import {
  FaCreditCard,
  FaWallet,
  FaMoneyBillWave,
  FaPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
} from "react-icons/fa";

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

const PaymentPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItems, handleOrder } = useGlobalContext();
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const addressList = useSelector((state) => state.addresses.addressList);
  const navigate = useNavigate();
  const location = useLocation();

  // Get selected address and delivery charge from location state
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod'); // Default payment method
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryDates, setDeliveryDates] = useState([]);

  // Get data from location state or redirect to address page
  useEffect(() => {
    if (location.state?.selectedAddressId && location.state?.deliveryCharge !== undefined) {
      setSelectedAddressId(location.state.selectedAddressId);
      setDeliveryCharge(location.state.deliveryCharge);
    } else {
      // If no address is selected, redirect to address page
      navigate('/checkout/address');
    }
  }, [location, navigate]);

  // Find selected address from addressList
  useEffect(() => {
    if (selectedAddressId && addressList.length) {
      const address = addressList.find(addr => addr._id === selectedAddressId);
      if (address) {
        setSelectedAddress(address);
      }
    }
  }, [selectedAddressId, addressList]);

  // Calculate estimated delivery dates for products
  useEffect(() => {
    try {
      if (cartItemsList && cartItemsList.length > 0) {
        // Calculate delivery dates (current date + 3-5 days)
        const today = new Date();
        const deliveryEstimates = cartItemsList.map((item, idx) => {
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
      
      const fallbackEstimates = Array(cartItemsList?.length || 0).fill().map((_, i) => ({
        productId: `fallback-${i}`,
        deliveryDate: fallbackDate,
        formattedDate: `${fallbackDate.getDate()} ${fallbackDate.toLocaleString('default', { month: 'short' })} ${fallbackDate.getFullYear()}`
      }));
      
      setDeliveryDates(fallbackEstimates);
    }
  }, [cartItemsList]);

  const handlePlaceOrder = async () => {
    // Validate selection
    if (!selectedAddressId) {
      toast.error("Please select an address");
      navigate('/checkout/address');
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
          totalAmount: totalPrice + deliveryCharge,
          addressId: selectedAddressId,
          subTotalAmt: totalPrice,
          deliveryCharge: deliveryCharge,
          quantity: totalQty,
        },
      });

      const { data: responseData } = response;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with stepper */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-24">
              <Link to="/">
                <img src={Logo} alt="DarkCart Logo" className="h-10" />
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                <Link to="/checkout/bag" className="hover:text-black">BAG</Link>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                <Link to="/checkout/address" className="hover:text-black">ADDRESS</Link>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="text-xs uppercase tracking-wide text-red-500 font-medium">PAYMENT</div>
            </div>
            <div className="w-24">
              {/* Placeholder for balance */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Options */}
          <div className="lg:col-span-2">
            {/* Payment Methods Section */}
            <div className="bg-white rounded shadow mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Select Payment Method</h2>
              </div>
              
              <div className="p-4">
                {/* Payment Methods List */}
                <div className="space-y-4">
                  {/* Cash On Delivery */}
                  <div className="border rounded overflow-hidden">
                    <div 
                      className={`p-4 flex items-center cursor-pointer ${
                        selectedPaymentMethod === 'cod' ? 'bg-red-50' : ''
                      }`}
                      onClick={() => setSelectedPaymentMethod('cod')}
                    >
                      <input
                        type="radio"
                        id="payment-cod"
                        name="payment-method"
                        checked={selectedPaymentMethod === 'cod'}
                        onChange={() => setSelectedPaymentMethod('cod')}
                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="payment-cod" className="ml-3 flex items-center cursor-pointer">
                        <FaMoneyBillWave className="text-gray-600 mr-2" />
                        <span className="font-medium">Cash On Delivery</span>
                      </label>
                    </div>
                    
                    {selectedPaymentMethod === 'cod' && (
                      <div className="p-4 border-t bg-gray-50">
                        <p className="text-sm text-gray-600">
                          Pay with cash when your order is delivered.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Note: Cash on delivery might not be available for all areas and order values.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Credit/Debit Card */}
                  <div className="border rounded overflow-hidden opacity-60">
                    <div className="p-4 flex items-center cursor-not-allowed">
                      <input
                        type="radio"
                        id="payment-card"
                        name="payment-method"
                        disabled
                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="payment-card" className="ml-3 flex items-center cursor-not-allowed">
                        <FaCreditCard className="text-gray-600 mr-2" />
                        <span className="font-medium">Credit/Debit Card</span>
                        <div className="ml-auto flex space-x-2">
                          <FaCcVisa className="text-blue-700 text-xl" />
                          <FaCcMastercard className="text-orange-600 text-xl" />
                          <FaCcAmex className="text-blue-500 text-xl" />
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* UPI */}
                  <div className="border rounded overflow-hidden opacity-60">
                    <div className="p-4 flex items-center cursor-not-allowed">
                      <input
                        type="radio"
                        id="payment-upi"
                        name="payment-method"
                        disabled
                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="payment-upi" className="ml-3 flex items-center cursor-not-allowed">
                        <FaWallet className="text-gray-600 mr-2" />
                        <span className="font-medium">UPI Payment</span>
                      </label>
                    </div>
                  </div>

                  {/* PayPal */}
                  <div className="border rounded overflow-hidden opacity-60">
                    <div className="p-4 flex items-center cursor-not-allowed">
                      <input
                        type="radio"
                        id="payment-paypal"
                        name="payment-method"
                        disabled
                        className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                      />
                      <label htmlFor="payment-paypal" className="ml-3 flex items-center cursor-not-allowed">
                        <FaPaypal className="text-blue-600 mr-2" />
                        <span className="font-medium">PayPal</span>
                      </label>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mt-4">
                    <p>
                      Note: Only Cash on Delivery is available for now. Other payment options will be enabled soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Address Display */}
            {selectedAddress && (
              <div className="bg-white rounded shadow mb-6">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Delivery Address</h2>
                </div>
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{selectedAddress.address_line}</span>
                        {selectedAddress.addressType === 'HOME' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                            HOME
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        Mobile: {selectedAddress.mobile}
                      </div>
                    </div>

                    <Link 
                      to="/checkout/address" 
                      className="text-sm text-red-500 font-medium hover:text-red-600"
                    >
                      Change
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
                  {cartItemsList.map((item, index) => {
                    // Use our safe access helper to get all needed properties
                    const itemId = getProductProperty(item, '_id', `item-${index}`);
                    const deliveryInfo = deliveryDates.find(d => d.productId === itemId);
                    
                    // Get image source safely
                    const imageSrc = getProductProperty(item, 'image[0]') || 
                                    getProductProperty(item, 'primaryImage') ||
                                    "https://via.placeholder.com/100?text=Product";
                    
                    // Get product details safely
                    const productTitle = getProductProperty(item, 'name', 'Product') || 
                                        getProductProperty(item, 'title', 'Product');
                    const size = getProductProperty(item, 'size', 'Standard');
                    const quantity = getProductProperty(item, 'quantity', 1);
                    const price = getProductProperty(item, 'price', 0);
                    const discount = getProductProperty(item, 'discount', 0);
                    const finalPrice = price * (1 - discount/100) || 0;
                    
                    return (
                      <div 
                        key={`preview-item-${index}`} 
                        className="flex items-start border-b pb-3 last:border-b-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-50 border border-gray-200 rounded overflow-hidden">
                          <img 
                            src={imageSrc}
                            alt={productTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/100?text=Product";
                            }}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium line-clamp-1" title={productTitle}>
                            {productTitle}
                          </h3>
                          
                          <div className="flex flex-wrap text-xs text-gray-500 mt-1">
                            <span className="mr-2">Size: {size}</span>
                            <span>Qty: {quantity}</span>
                          </div>
                          
                          <div className="mt-1 flex items-center">
                            <span className="font-medium text-sm">
                              {DisplayPriceInRupees(finalPrice)}
                            </span>
                            {discount > 0 && (
                              <>
                                <span className="mx-1 text-xs line-through text-gray-400">
                                  {DisplayPriceInRupees(price)}
                                </span>
                                <span className="text-xs text-green-600">
                                  {discount}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="mt-1">
                            <span className="text-xs text-red-700 font-medium">
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
                    <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>₹{(totalPrice + deliveryCharge).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedPaymentMethod}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 mt-6 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
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
    </div>
  );
};

// Wrap with ErrorBoundary for better error handling
const PaymentPageWithErrorBoundary = () => (
  <ErrorBoundary>
    <PaymentPage />
  </ErrorBoundary>
);

export default PaymentPageWithErrorBoundary;
