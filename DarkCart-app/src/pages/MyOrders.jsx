import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaMapMarkerAlt, FaCity, FaFlag, FaMailBulk, FaBox, FaUser, FaEnvelope, FaCalendar, FaTimes, FaExclamationTriangle, FaBan, FaRedo } from 'react-icons/fa'
import AnimatedImage from '../components/NoData';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import OrderTimeline from '../components/OrderTimeline';
import OrderCancellationModal from '../components/OrderCancellationModal';
import { useGlobalContext } from '../provider/GlobalProvider';
import { setOrders } from '../store/orderSlice';

function MyOrders() {
  // Get all orders from Redux store
  const allOrders = useSelector((state) => state.order.orders);
  // Get current user information
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [orderCancellationRequests, setOrderCancellationRequests] = useState([]);
  const { fetchOrders, refreshingOrders } = useGlobalContext();
  
  // Function to fetch current user's orders specifically (not all orders for admin)
  const fetchCurrentUserOrders = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.getOrderList.url,
        method: SummaryApi.getOrderList.method
      });
      
      if (response.data.success) {
        console.log('Fetched current user orders:', response.data.data.length);
        dispatch(setOrders(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching current user orders:", error);
    }
  };
  
  // Function to fetch user's cancellation requests
  const fetchUserCancellationRequests = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await Axios({
        ...SummaryApi.getUserCancellationRequests,
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setOrderCancellationRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cancellation requests:", error);
    }
  };

  // Check if an order has a pending cancellation request
  const hasPendingCancellationRequest = (orderId) => {
    return orderCancellationRequests.some(request => 
      (request.orderId === orderId || request.orderId?._id === orderId) && 
      request.status === 'PENDING'
    );
  };

  // Filter orders to only show the current user's orders, even for admin
  useEffect(() => {
    if (allOrders && allOrders.length > 0 && user && user._id) {
      const filteredOrders = allOrders.filter(order => {
        const orderUserId = order.userId?._id || order.userId;
        const currentUserId = user._id;
        const isMatch = orderUserId === currentUserId;
        
        // More detailed debugging
        if (!isMatch) {
          console.log('Order does not match user:', {
            orderUserId,
            currentUserId,
            orderUserIdType: typeof orderUserId,
            currentUserIdType: typeof currentUserId,
            order: order
          });
        }
        
        return isMatch;
      });
      
      console.log('Filtered orders for user:', {
        userId: user._id,
        totalOrders: allOrders.length,
        userOrders: filteredOrders.length,
        isAdmin: user.role?.toUpperCase() === 'ADMIN',
        firstOrderUserId: allOrders[0]?.userId?._id || allOrders[0]?.userId,
        currentUserId: user._id
      });
      
      setUserOrders(filteredOrders);
    } else {
      console.log('No orders or user data:', {
        allOrdersLength: allOrders?.length || 0,
        userId: user?._id,
        hasUser: !!user
      });
      setUserOrders([]);
    }
  }, [allOrders, user]);
  
  const handleCancelOrder = (orderData) => {
    setOrderToCancel(orderData);
    setShowCancellationModal(true);
  };

  const handleCancellationRequested = () => {
    // Refresh orders and cancellation requests after cancellation request is submitted
    fetchCurrentUserOrders();
    fetchUserCancellationRequests();
    setOrderToCancel(null);
  };

  // Use the fetchOrders from GlobalContext instead of local implementation
  const refreshOrders = () => {
    // For MyOrders page, always fetch only current user's orders (not all orders even for admin)
    fetchCurrentUserOrders();
    toast.success('Refreshing order status...');
  };
  
  // Fetch orders when component mounts - always user's own orders
  useEffect(() => {
    fetchCurrentUserOrders();
    if (user && user._id) {
      fetchUserCancellationRequests();
    }
  }, [user]);

  const { updateOrderStatus } = useGlobalContext();

  const canCancelOrder = (orderData) => {
    // Check if order can be cancelled (not delivered, not already cancelled)
    const nonCancellableStatuses = ['DELIVERED', 'CANCELLED'];
    
    // Don't show cancel button if order status doesn't allow cancellation
    if (nonCancellableStatuses.includes(orderData?.orderStatus)) {
      return false;
    }
    
    // Don't show cancel button if there's already a pending cancellation request
    if (hasPendingCancellationRequest(orderData._id)) {
      return false;
    }
    
    return true;
  };

  const isOrderCancelled = (orderData) => {
    return orderData?.orderStatus === 'CANCELLED';
  };

  // Helper function to determine payment status display
  const getPaymentStatus = (orderData) => {
    // Check if there's a pending cancellation request first
    if (hasPendingCancellationRequest(orderData._id)) {
      return "CANCELLATION_REQUESTED";
    }
    
    // If payment is explicitly set to PAID
    if (orderData?.paymentStatus === "PAID") {
      return "PAID";
    }
    
    // If order is delivered, should be paid (cash on delivery)
    if (orderData?.orderStatus === "DELIVERED") {
      return "PAID";
    }
    
    // For cancelled orders
    if (orderData?.orderStatus === "CANCELLED") {
      return "CANCELLED";
    }
    
    // For all other cases (ORDER PLACED, PROCESSING, OUT FOR DELIVERY)
    return "PENDING";
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Responsive */}
      <div className='bg-white shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 flex items-center justify-between border-b border-gray-200'>
        <div className='flex items-center gap-2 sm:gap-3'>
          <FaBox className='text-lg sm:text-xl text-black' />
          <div>
            <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-black'>My Orders</h1>
            {user && user.role?.toUpperCase() === 'ADMIN' && (
              <p className="text-xs text-gray-500 mt-1">
                Only showing orders you have placed personally
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-1 hidden sm:inline">
            {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}
          </span>
          <button 
            onClick={refreshOrders}
            disabled={refreshingOrders}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaRedo className={`w-3 h-3 ${refreshingOrders ? 'animate-spin' : ''}`} />
            {refreshingOrders ? 'Refreshing...' : 'Refresh Orders'}
          </button>
        </div>
      </div>

      {
        userOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <AnimatedImage/>
            <p className="text-gray-500 text-center mt-4">
              {user && user.role?.toUpperCase() === 'ADMIN'
                ? "You haven't placed any orders yet. Orders you place will appear here."
                : "You haven't placed any orders yet."
              }
            </p>
          </div>
        )
      }
      
      {
        userOrders.map((order,index)=>{
          const isCancelled = isOrderCancelled(order);
          
          return(
            <div key={order?._id+index+"order"} className={`relative transition-all duration-300 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 rounded-lg mx-2 sm:mx-4 md:mx-6 lg:mx-8 ${
              isCancelled 
                ? 'bg-red-50 border-2 border-red-200 shadow-sm opacity-75' 
                : 'bg-white shadow-sm hover:shadow-md border border-gray-200'
            }`}>
              
              {/* Cancelled Order Overlay */}
              {isCancelled && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4">
                  <div className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 text-xs sm:text-sm font-bold shadow-lg">
                    <FaBan className="w-3 h-3" />
                    <span>CANCELLED</span>
                  </div>
                </div>
              )}

              {/* Cancelled Order Diagonal Stripe */}
              {isCancelled && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-red-100/30 to-transparent opacity-50 rounded-lg"></div>
                </div>
              )}

              <div className='flex flex-col xl:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative z-10'>
                
                {/* Product/Bundle Image - Responsive */}
                <div className='flex-shrink-0 order-1 xl:order-2 w-full xl:w-auto flex justify-center xl:justify-start'>
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-lg overflow-hidden border-2 relative ${isCancelled ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                    {/* Display first item image - handle both bundles and products */}
                    <img
                      src={
                        order?.items[0]?.itemType === 'bundle' 
                          ? order?.items[0]?.bundleDetails?.image 
                          : order?.items[0]?.productDetails?.image[0]
                      }
                      alt={
                        order?.items[0]?.itemType === 'bundle' 
                          ? order?.items[0]?.bundleDetails?.title 
                          : order?.items[0]?.productDetails?.name
                      }
                      className={`w-full h-full object-cover transition-all duration-300 ${isCancelled ? 'grayscale opacity-60' : ''}`}
                    />
                    {isCancelled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <FaBan className="text-red-500 text-2xl sm:text-3xl md:text-4xl drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details - Responsive */}
                <div className='flex-1 space-y-3 sm:space-y-4 md:space-y-5 order-2 xl:order-1 w-full'>
                  
                  {/* Order Header - Responsive */}
                  <div className={`rounded-lg p-2 sm:p-3 md:p-4 border ${
                    isCancelled 
                      ? 'bg-red-100 border-red-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                        <div className='flex items-center gap-2'>
                          <FaBox className={`text-xs sm:text-sm ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                          <span className={`text-xs sm:text-sm font-medium ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>Order No:</span>
                        </div>
                        <span className={`text-xs sm:text-sm font-bold break-all ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                          {order?.orderId}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 mt-2 sm:mt-0'>
                        {/* Order Status Badge - Conditionally show payment status based on helper function */}
                        {getPaymentStatus(order) === "PAID" ? (
                          <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit bg-green-100 text-green-800 border border-green-200">
                            ✓ Paid
                          </span>
                        ) : getPaymentStatus(order) === "CANCELLED" ? (
                          <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit bg-red-100 text-red-800 border border-red-200">
                            ✗ Cancelled
                          </span>
                        ) : getPaymentStatus(order) === "CANCELLATION_REQUESTED" ? (
                          <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit bg-orange-100 text-orange-800 border border-orange-200">
                            📋 Cancellation Requested
                          </span>
                        ) : (
                          <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit bg-yellow-100 text-yellow-800 border border-yellow-200">
                            ⏱ Payment Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product/Bundle Name and Items - Responsive */}
                  <div>
                    {/* Display all items in the order */}
                    <div className="space-y-2 sm:space-y-3">
                      {order?.items?.map((item, itemIndex) => (
                        <div key={`${order._id}-item-${itemIndex}`} className={`rounded-lg p-2 sm:p-3 border ${
                          isCancelled ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-start gap-2 sm:gap-3">
                            {/* Item image */}
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border flex-shrink-0 ${
                              isCancelled ? 'border-red-300' : 'border-gray-200'
                            }`}>
                              <img
                                src={
                                  item?.itemType === 'bundle' 
                                    ? item?.bundleDetails?.image 
                                    : item?.productDetails?.image?.[0]
                                }
                                alt={
                                  item?.itemType === 'bundle' 
                                    ? item?.bundleDetails?.title 
                                    : item?.productDetails?.name
                                }
                                className={`w-full h-full object-cover ${
                                  isCancelled ? 'grayscale opacity-60' : ''
                                }`}
                              />
                            </div>
                            
                            {/* Item details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-bold text-sm sm:text-base leading-tight truncate ${
                                    isCancelled ? 'text-red-800 line-through' : 'text-black'
                                  }`}>
                                    {item?.itemType === 'bundle' ? item?.bundleDetails?.title : item?.productDetails?.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      item?.itemType === 'bundle' 
                                        ? (isCancelled ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800')
                                        : (isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800')
                                    }`}>
                                      {item?.itemType === 'bundle' ? '📦 Bundle' : '🏷️ Product'}
                                    </span>
                                    <span className={`text-xs font-medium ${
                                      isCancelled ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                      Qty: {item?.quantity}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`font-bold text-sm sm:text-base ${
                                    isCancelled ? 'text-red-800 line-through' : 'text-black'
                                  }`}>
                                    ₹{item?.itemType === 'bundle' ? item?.bundleDetails?.bundlePrice : item?.productDetails?.price}
                                  </div>
                                  <div className={`text-xs ${
                                    isCancelled ? 'text-red-600' : 'text-gray-500'
                                  }`}>
                                    Total: ₹{item?.itemTotal}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className={`mt-3 p-2 sm:p-3 rounded-lg border ${
                      isCancelled ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold text-sm sm:text-base ${
                          isCancelled ? 'text-red-800' : 'text-black'
                        }`}>
                          Order Total ({order?.totalQuantity} {order?.totalQuantity === 1 ? 'item' : 'items'})
                        </span>
                        <span className={`font-bold text-lg sm:text-xl ${
                          isCancelled ? 'text-red-800 line-through' : 'text-black'
                        }`}>
                          ₹{order?.totalAmt}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`h-0.5 w-12 sm:w-16 md:w-20 rounded-full mt-2 ${
                      isCancelled ? 'bg-red-400' : 'bg-black'
                    }`}></div>
                  </div>
                  
                  {/* Order Timeline */}
                  <div className={`rounded-lg p-2 sm:p-3 md:p-4 border ${
                    isCancelled 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h4 className={`font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base ${
                      isCancelled ? 'text-red-800' : 'text-black'
                    }`}>
                      <FaBox className={`text-xs sm:text-sm ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                      Order Status
                    </h4>
                    <OrderTimeline status={order?.orderStatus} />
                  </div>
                  
                  {/* Customer Info - Responsive */}
                  <div className={`rounded-lg p-2 sm:p-3 md:p-4 border ${
                    isCancelled 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h4 className={`font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base ${
                      isCancelled ? 'text-red-800' : 'text-black'
                    }`}>
                      <FaUser className={`text-xs sm:text-sm ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                      Customer Information
                    </h4>
                    <div className='space-y-1 sm:space-y-2 ml-4 sm:ml-6'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                        <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>Name:</span>
                        <span className={`font-semibold text-xs sm:text-sm break-words ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                          {order?.userId?.name}
                        </span>
                      </div>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                        <div className='flex items-center gap-1 sm:gap-2'>
                          <FaEnvelope className={`text-xs ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                          <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>Email:</span>
                        </div>
                        <span className={`text-xs sm:text-sm break-all ${isCancelled ? 'text-red-600' : 'text-gray-600'}`}>
                          {order?.userId?.email}
                        </span>
                      </div>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                        <div className='flex items-center gap-1 sm:gap-2'>
                          <FaCalendar className={`text-xs ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                          <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>Date:</span>
                        </div>
                        <span className={`font-semibold text-xs sm:text-sm break-words ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                          {new Date(order?.orderDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery Address - Enhanced Responsive */}
                  <div className={`rounded-lg p-2 sm:p-3 md:p-4 border ${
                    isCancelled 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                      <FaMapMarkerAlt className={`text-xs sm:text-sm ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                      <span className={`font-semibold text-sm sm:text-base ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                        Delivery Address
                      </span>
                      {isCancelled && (
                        <span className="text-xs text-red-600 font-medium">(Order Cancelled)</span>
                      )}
                    </div>
                    <div className='space-y-2 sm:space-y-3 ml-4 sm:ml-6'>
                      {/* Street Address */}
                      <div className={`rounded-md p-2 sm:p-3 border ${
                        isCancelled 
                          ? 'bg-red-25 border-red-200' 
                          : 'bg-white border-gray-200'
                      }`}>
                        <div className='flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2'>
                          <span className={`font-medium text-xs sm:text-sm min-w-fit ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>Street:</span>
                          <span className={`font-medium text-xs sm:text-sm break-words ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                            {order?.deliveryAddress?.address_line}
                          </span>
                        </div>
                      </div>
                      
                      {/* City & State - Responsive Grid */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3'>
                        <div className={`rounded-md p-2 sm:p-3 border ${
                          isCancelled 
                            ? 'bg-red-25 border-red-200' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                            <div className='flex items-center gap-1 sm:gap-2'>
                              <FaCity className={`text-xs ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                              <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>City:</span>
                            </div>
                            <span className={`font-medium text-xs sm:text-sm break-words ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                              {order?.deliveryAddress?.city}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`rounded-md p-2 sm:p-3 border ${
                          isCancelled 
                            ? 'bg-red-25 border-red-200' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                            <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>State:</span>
                            <span className={`font-medium text-xs sm:text-sm break-words ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                              {order?.deliveryAddress?.state}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* PIN & Country - Responsive Grid */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3'>
                        <div className={`rounded-md p-2 sm:p-3 border ${
                          isCancelled 
                            ? 'bg-red-25 border-red-200' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                            <div className='flex items-center gap-1 sm:gap-2'>
                              <FaMailBulk className={`text-xs ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                              <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>PIN:</span>
                            </div>
                            <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                              {order?.deliveryAddress?.pincode}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`rounded-md p-2 sm:p-3 border ${
                          isCancelled 
                            ? 'bg-red-25 border-red-200' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                            <div className='flex items-center gap-1 sm:gap-2'>
                              <FaFlag className={`text-xs ${isCancelled ? 'text-red-600' : 'text-black'}`} />
                              <span className={`font-medium text-xs sm:text-sm ${isCancelled ? 'text-red-700' : 'text-gray-700'}`}>Country:</span>
                            </div>
                            <span className={`font-medium text-xs sm:text-sm break-words ${isCancelled ? 'text-red-800' : 'text-black'}`}>
                              {order?.deliveryAddress?.country}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Controls */}
                  {!isCancelled && (
                    <div className="flex justify-end mt-4">
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          disabled={cancellingOrderId === order.orderId}
                          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                            cancellingOrderId === order.orderId
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {cancellingOrderId === order.orderId ? (
                            <div className='flex items-center gap-2'>
                              <div className='w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin'></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <>
                              <FaTimes className='inline w-4 h-4 mr-2' />
                              Cancel Order
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })
      }

      {/* Cancel Order Confirmation Modal */}
      {/* Order Cancellation Modal */}
      {showCancellationModal && orderToCancel && (
        <OrderCancellationModal
          order={orderToCancel}
          onClose={() => {
            setShowCancellationModal(false);
            setOrderToCancel(null);
          }}
          onCancellationRequested={handleCancellationRequested}
        />
      )}
    </div>
  )
}

export default MyOrders