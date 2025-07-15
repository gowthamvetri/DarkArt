import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Logo from '../assets/logo.png';
import noCart from '../assets/noCart.jpg';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  toggleItemSelection, 
  selectAllItems, 
  deselectAllItems,
  setSelectedItems 
} from '../store/cartProduct';

// Helper function to safely access product properties
const getProductProperty = (item, propertyPath, fallback = "") => {
  try {
    if (!item) return fallback;
    
    const paths = [
      `product.${propertyPath}`,
      `productId.${propertyPath}`,
      `bundleId.${propertyPath}`,
      propertyPath
    ];
    
    for (const path of paths) {
      const value = path.split('.').reduce((obj, key) => {
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

const BagPage = () => {
  const { fetchCartItems } = useGlobalContext();
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const selectedItems = useSelector((state) => state.cartItem.selectedItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Calculate totals for selected items only
  const selectedCartItems = cartItemsList.filter(item => selectedItems.includes(item._id));
  
  const selectedTotals = selectedCartItems.reduce((totals, item) => {
    const pricing = calculateItemPricing(item);
    return {
      totalQty: totals.totalQty + pricing.quantity,
      totalPrice: totals.totalPrice + pricing.totalPrice,
      totalOriginalPrice: totals.totalOriginalPrice + pricing.totalOriginalPrice
    };
  }, { totalQty: 0, totalPrice: 0, totalOriginalPrice: 0 });

  // Auto-select all items when cart loads initially
  useEffect(() => {
    if (cartItemsList.length > 0 && selectedItems.length === 0) {
      dispatch(selectAllItems());
    }
  }, [cartItemsList, selectedItems.length, dispatch]);

  // Inspect the cart on component mount
  React.useEffect(() => {
    if (cartItemsList && cartItemsList.length > 0) {
      console.log("BagPage: Initial cart inspection");
      cartItemsList.forEach((item, index) => {
        console.log(`Item ${index} price check:`, {
          itemType: item.itemType,
          productId_price: item.productId?.price,
          bundleId_bundlePrice: item.bundleId?.bundlePrice,
          directPrice: item.price,
          quantity: item.quantity,
          isSelected: selectedItems.includes(item._id)
        });
      });
    }
  }, [cartItemsList, selectedItems]);
  
  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: {
          _id: itemId,
          qty: quantity,
        },
      });

      const { data } = response;
      if (data.success) {
        fetchCartItems();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error updating cart item:", error);
      return { success: false, error };
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: itemId,
        },
      });

      const { data } = response;
      if (data.success) {
        fetchCartItems();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return { success: false, error };
    }
  };

  const handleQuantityChange = async (item, currentQty, change) => {
    const newQty = currentQty + change;
    const itemId = item._id;
    
    if (!itemId) {
      toast.error("Updating cart item...");
      console.log("Full cart item:", JSON.stringify(item, null, 2));
      return;
    }
    
    if (newQty <= 0) {
      const result = await deleteCartItem(itemId);
      if (result.success) {
        toast.success("Item removed from bag");
      } else {
        toast.error("Failed to remove item");
      }
    } else {
      const result = await updateCartItem(itemId, newQty);
      if (result.success) {
        toast.success(change > 0 ? "Quantity increased" : "Quantity decreased");
      } else {
        toast.error("Failed to update quantity");
      }
    }
  };

  const handleRemoveItem = async (item) => {
    const itemId = item._id;
    
    if (!itemId) {
      toast.error("Item ID not found");
      console.error("Item ID not found in:", item);
      return;
    }
    
    const result = await deleteCartItem(itemId);
    if (result.success) {
      toast.success("Item removed from bag");
    } else {
      toast.error("Failed to remove item");
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to checkout");
      return;
    }
    
    // Store selected items in sessionStorage for checkout process
    sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    navigate('/checkout/address');
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItemsList.length) {
      dispatch(deselectAllItems());
    } else {
      dispatch(selectAllItems());
    }
  };

  const handleItemSelection = (itemId) => {
    dispatch(toggleItemSelection(itemId));
  };

  const moveToWishlist = (item) => {
    const itemId = item._id;
    
    if (!itemId) {
      toast.error("Item ID not found");
      console.error("Item ID not found in:", item);
      return;
    }
    
    toast.success("Item moved to wishlist");
    // Implement actual wishlist functionality here
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
              <div className="text-xs uppercase tracking-wide text-teal-400 font-medium">BAG</div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="text-xs uppercase tracking-wide text-gray-300">
                <span className="cursor-pointer hover:text-white">ADDRESS</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="text-xs uppercase tracking-wide text-gray-300">
                <span className="cursor-not-allowed">PAYMENT</span>
              </div>
            </div>
            <div className="w-24">
              {/* Placeholder to balance the layout */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {cartItemsList.length === 0 ? (
          <div className="bg-white rounded shadow p-8 text-center">
            <div className="text-xl font-medium mb-4">Your bag is empty</div>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your bag yet.</p>
            <Link to="/" className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Bag Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded shadow mb-6">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">
                      {cartItemsList.length} {cartItemsList.length === 1 ? 'ITEM' : 'ITEMS'} IN BAG
                    </h2>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectedItems.length === cartItemsList.length && cartItemsList.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="selectAll" className="text-sm font-medium cursor-pointer">
                        Select All ({selectedItems.length}/{cartItemsList.length})
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Debug button to check cart structure */}
                  {import.meta.env.DEV && (
                    <button 
                      onClick={() => {
                        console.log("Cart items structure:", cartItemsList);
                        console.log("Selected items:", selectedItems);
                        console.log("Selected totals:", selectedTotals);
                        if (cartItemsList && cartItemsList.length > 0) {
                          console.log("First item structure:", JSON.stringify(cartItemsList[0], null, 2));
                          
                          const item = cartItemsList[0];
                          console.log("Price extraction paths:");
                          console.log("- item.productId?.price:", item.productId?.price);
                          console.log("- item.bundleId?.bundlePrice:", item.bundleId?.bundlePrice);
                          console.log("- item.product?.price:", item.product?.price);
                          console.log("- item.price:", item.price);
                          
                          console.log("calculateItemPricing result:", calculateItemPricing(item));
                        }
                        toast.success("Cart structure logged to console for debugging");
                      }}
                      className="mb-4 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded"
                    >
                      Debug Cart Structure
                    </button>
                  )}
                  
                  {cartItemsList.map((item, index) => {
                    const itemId = getProductProperty(item, '_id', `item-${index}`);
                    const pricing = calculateItemPricing(item);
                    const isSelected = selectedItems.includes(item._id);
                    
                    // Get image source safely
                    let imageSrc = noCart;
                    if (item.productId && item.productId._id) {
                      imageSrc = item.productId.image?.[0] || item.productId.primaryImage || noCart;
                    } else if (item.bundleId && item.bundleId._id) {
                      imageSrc = item.bundleId.images?.[0] || item.bundleId.image || noCart;
                    } else {
                      imageSrc = item.image?.[0] || item.images?.[0] || item.primaryImage || item.image || noCart;
                    }
                    
                    const size = getProductProperty(item, 'size', 'Standard');
                    const brand = getProductProperty(item, 'brand', '');
                    
                    return (
                      <div key={`bag-item-${itemId}-${index}`} className={`flex border-b last:border-b-0 py-4 ${isSelected ? 'bg-blue-50' : ''}`}>
                        <div className="flex flex-col sm:flex-row items-start w-full">
                          {/* Checkbox and Product Image */}
                          <div className="flex items-start">
                            <div className="mr-3">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleItemSelection(item._id)}
                                className="h-5 w-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                              />
                            </div>
                            <div className="w-20 h-24 flex-shrink-0">
                              <img 
                                src={imageSrc} 
                                alt={pricing.productTitle}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = noCart;
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Product Details */}
                          <div className="ml-8 flex-1 mt-4 sm:mt-0">
                            {brand && (
                              <div className="text-gray-700 font-medium">{brand}</div>
                            )}
                            <h3 className="font-medium text-lg">
                              {pricing.productTitle}
                              {pricing.isBundle && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Bundle
                                </span>
                              )}
                            </h3>
                            
                            <div className="text-sm text-gray-600 mt-1">
                              Size: {size}
                            </div>
                            
                            {/* Price Display - NO DISCOUNT SHOWN */}
                            <div className="flex items-center mt-3">
                              <div className="text-md">
                                <span className="font-semibold text-lg">
                                  {pricing.displayPrice > 0 ? DisplayPriceInRupees(pricing.totalPrice) : "Price unavailable"}
                                </span>
                                {pricing.quantity > 1 && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({DisplayPriceInRupees(pricing.finalPrice)} each)
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-md">
                                <button 
                                  onClick={() => handleQuantityChange(item, pricing.quantity, -1)}
                                  className="px-3 py-1 text-lg font-medium hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <div className="px-3 py-1 text-sm font-medium">
                                  {pricing.quantity}
                                </div>
                                <button 
                                  onClick={() => handleQuantityChange(item, pricing.quantity, 1)}
                                  className="px-3 py-1 text-lg font-medium hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              
                              <div className="flex space-x-4">
                                <button 
                                  onClick={() => moveToWishlist(item)}
                                  className="text-sm text-gray-700 hover:text-teal-600"
                                >
                                  MOVE TO WISHLIST
                                </button>
                                <button 
                                  onClick={() => handleRemoveItem(item)}
                                  className="text-sm text-gray-700 hover:text-teal-600"
                                >
                                  REMOVE
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Right Column - Price Details (Only for selected items) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded shadow sticky top-4">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">
                    PRICE DETAILS ({selectedTotals.totalQty} {selectedTotals.totalQty === 1 ? 'Item' : 'Items'} Selected)
                  </h2>
                </div>
                
                <div className="p-4">
                  {selectedItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No items selected for checkout</p>
                      <p className="text-sm text-gray-400">Select items from your bag to see price details</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total MRP</span>
                        <span>₹{selectedTotals.totalOriginalPrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Discount on MRP</span>
                        <span className="text-green-600">-₹{(selectedTotals.totalOriginalPrice - selectedTotals.totalPrice).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Platform Fee</span>
                        <div className="flex items-center">
                          <span className="line-through text-gray-500 mr-1">₹99</span>
                          <span className="text-green-600">FREE</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount</span>
                          <span>₹{selectedTotals.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={selectedItems.length === 0}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 mt-6 font-medium flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <span>PLACE ORDER ({selectedItems.length})</span>
                    <FaArrowRight className="ml-2" />
                  </button>
                  
                  <div className="mt-6 text-xs text-center text-gray-600">
                    <p>Safe and Secure Payments. Easy returns.</p>
                    <p>100% Authentic products.</p>
                    {selectedItems.length > 0 && (
                      <p className="mt-2 text-sm font-medium text-blue-600">
                        {cartItemsList.length - selectedItems.length} items will remain in your bag
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap with ErrorBoundary for better error handling
const BagPageWithErrorBoundary = () => (
  <ErrorBoundary>
    <BagPage />
  </ErrorBoundary>
);

export default BagPageWithErrorBoundary;
