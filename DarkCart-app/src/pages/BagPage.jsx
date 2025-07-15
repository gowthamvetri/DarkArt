import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Logo from '../assets/logo.png';
import noCart from '../assets/noCart.jpg'; // Import fallback image
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import ErrorBoundary from '../components/ErrorBoundary';

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

const BagPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItems } = useGlobalContext();
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();
  
  // Inspect the cart on component mount
  React.useEffect(() => {
    if (cartItemsList && cartItemsList.length > 0) {
      console.log("BagPage: Initial cart inspection");
      cartItemsList.forEach((item, index) => {
        // Log price extraction paths for debugging
        console.log(`Item ${index} price check:`, {
          itemType: item.itemType,
          productId_price: item.productId?.price,
          bundleId_bundlePrice: item.bundleId?.bundlePrice,
          directPrice: item.price,
          quantity: item.quantity
        });
      });
    }
  }, [cartItemsList]);
  
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
    
    // Get the cart item ID directly from the item object
    const itemId = item._id;
    
    // If ID not found in the primary location, try to find it elsewhere in the object
    if (!itemId) {
      toast.error("Updating cart item...");
      console.log("Full cart item:", JSON.stringify(item, null, 2));
      return;
    }
    
    if (newQty <= 0) {
      // Remove item if quantity becomes 0
      const result = await deleteCartItem(itemId);
      if (result.success) {
        toast.success("Item removed from bag");
      } else {
        toast.error("Failed to remove item");
      }
    } else {
      // Update quantity
      const result = await updateCartItem(itemId, newQty);
      if (result.success) {
        toast.success(change > 0 ? "Quantity increased" : "Quantity decreased");
      } else {
        toast.error("Failed to update quantity");
      }
    }
  };

  const handleRemoveItem = async (item) => {
    // Get the cart item ID - this is the ID of the cart item, not the product
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
    if (cartItemsList.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    navigate('/checkout/address');
  };

  // Move item to wishlist (placeholder - implement actual functionality as needed)
  const moveToWishlist = (item) => {
    // Get the cart item ID - this is the ID of the cart item, not the product
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
                      {totalQty} {totalQty === 1 ? 'ITEM' : 'ITEMS'} SELECTED
                    </h2>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Debug button to check cart structure */}
                  <button 
                    onClick={() => {
                      console.log("Cart items structure:", cartItemsList);
                      if (cartItemsList && cartItemsList.length > 0) {
                        console.log("First item structure:", JSON.stringify(cartItemsList[0], null, 2));
                        
                        // Log price extraction paths for debugging
                        const item = cartItemsList[0];
                        console.log("Price extraction paths:");
                        console.log("- item.productId?.price:", item.productId?.price);
                        console.log("- item.bundleId?.bundlePrice:", item.bundleId?.bundlePrice);
                        console.log("- item.product?.price:", item.product?.price);
                        console.log("- item.price:", item.price);
                        
                        // Check what getProductProperty returns for price
                        console.log("getProductProperty('price'):", getProductProperty(item, 'price', 0));
                      }
                      toast.success("Cart structure logged to console for debugging");
                    }}
                    className="mb-4 text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded"
                  >
                    Debug Cart Structure
                  </button>
                  
                  {cartItemsList.map((item, index) => {
                    const itemId = getProductProperty(item, '_id', `item-${index}`);
                    
                    // Get image source safely
                    const imageSrc = getProductProperty(item, 'image[0]') || 
                                    getProductProperty(item, 'primaryImage') ||
                                    noCart; // Use local fallback image
                    
                    // Get product details safely
                    const productTitle = getProductProperty(item, 'name', 'Product') || 
                                        getProductProperty(item, 'title', 'Product');
                    const size = getProductProperty(item, 'size', 'Standard');
                    const quantity = getProductProperty(item, 'quantity', 1);
                    
                    // Enhanced price extraction with more paths and debug logging
                    let price = 0;
                    let priceSource = 'unknown';
                    
                    if (item.productId && item.productId.price) {
                      price = item.productId.price;
                      priceSource = 'productId.price';
                    } else if (item.bundleId && item.bundleId.bundlePrice) {
                      price = item.bundleId.bundlePrice;
                      priceSource = 'bundleId.bundlePrice';
                    } else if (item.product && item.product.price) {
                      price = item.product.price;
                      priceSource = 'product.price';
                    } else if (item.price) {
                      price = item.price;
                      priceSource = 'item.price';
                    } else {
                      // Log debug info for this item if price is missing
                      console.log(`Price missing for item (index: ${index}):`, item);
                      console.log('Attempting to access via getProductProperty:', getProductProperty(item, 'price', 0));
                    }
                    
                    console.log(`Item ${index} price: ${price} (source: ${priceSource})`);
                    
                    // Enhanced discount extraction
                    let discount = 0;
                    if (item.productId && item.productId.discount) {
                      discount = item.productId.discount;
                    } else if (item.bundleId && item.bundleId.discount) {
                      discount = item.bundleId.discount;
                    } else if (item.product && item.product.discount) {
                      discount = item.product.discount;
                    } else if (item.discount) {
                      discount = item.discount;
                    }
                    
                    // Calculate final price with fallback
                    const finalPrice = price > 0 ? (price * (1 - discount/100)) : 0;
                    const brand = getProductProperty(item, 'brand', '');
                    
                    return (
                      <div key={`bag-item-${itemId}-${index}`} className="flex border-b last:border-b-0 py-4">
                        <div className="flex flex-col sm:flex-row items-start w-full">
                          {/* Checkbox and Product Image */}
                          <div className="flex items-start">
                            <div className="mr-3">
                              <input 
                                type="checkbox" 
                                checked={true} 
                                readOnly
                                className="h-5 w-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                              />
                            </div>
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
                          </div>
                          
                          {/* Product Details */}
                          <div className="ml-8 flex-1 mt-4 sm:mt-0">
                            {brand && (
                              <div className="text-gray-700 font-medium">{brand}</div>
                            )}
                            <h3 className="font-medium text-lg">{productTitle}</h3>
                            
                            <div className="text-sm text-gray-600 mt-1">
                              Size: {size}
                            </div>
                            
                            <div className="flex items-center mt-3">
                              <div className="text-md">
                                <span className="font-semibold">
                                  {price > 0 ? DisplayPriceInRupees(finalPrice) : "Price unavailable"}
                                </span>
                                {discount > 0 && price > 0 && (
                                  <>
                                    <span className="ml-2 text-sm line-through text-gray-500">
                                      {DisplayPriceInRupees(price)}
                                    </span>
                                    <span className="ml-2 text-sm text-green-600 font-medium">
                                      {discount}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-md">
                                <button 
                                  onClick={() => handleQuantityChange(item, quantity, -1)}
                                  className="px-3 py-1 text-lg font-medium hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <div className="px-3 py-1 text-sm font-medium">
                                  {quantity}
                                </div>
                                <button 
                                  onClick={() => handleQuantityChange(item, quantity, 1)}
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
            
            {/* Right Column - Price Details */}
            <div className="lg:col-span-1">
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
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 mt-6 font-medium flex items-center justify-center"
                  >
                    <span>PLACE ORDER</span>
                    <FaArrowRight className="ml-2" />
                  </button>
                  
                  <div className="mt-6 text-xs text-center text-gray-600">
                    <p>Safe and Secure Payments. Easy returns.</p>
                    <p>100% Authentic products.</p>
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
