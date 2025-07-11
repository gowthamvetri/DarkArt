import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaMapMarkerAlt, FaCity, FaFlag, FaMailBulk, FaBox, FaUser, FaEnvelope, FaCalendar, FaTimes, FaExclamationTriangle, FaBan } from 'react-icons/fa'
import AnimatedImage from '../components/NoData';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';

function MyOrders() {
  const order = useSelector((state) => state.order.orders);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  
  console.log(order);
  const handleCancelOrder = (orderData) => {
    setOrderToCancel(orderData);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    console.log("Before enter : ", orderToCancel);
    if (!orderToCancel) return;
    setCancellingOrderId(orderToCancel.orderId);
    setShowCancelModal(false);
    console.log(cancellingOrderId)
    try {
      const response = await Axios({
        url: SummaryApi.cancelOrder.url,
        method: SummaryApi.cancelOrder.method,
        data: {
          orderId: orderToCancel.orderId,
        }
      })
      toast.success('Order cancelled successfully!');
    } catch (error) {
      toast.error('Failed to cancel order. Please try again.');
      console.error('Cancel order error:', error);
    } finally {
      setCancellingOrderId(null);
      setOrderToCancel(null);
    }
  };

  const canCancelOrder = (orderData) => {
    const orderDate = new Date(orderData?.orderDate);
    const now = new Date();
    const hoursSinceOrder = (now - orderDate) / (1000 * 60 * 60);
    return hoursSinceOrder < 24 && orderData?.paymentStatus !== 'paid' && orderData?.status !== 'cancelled';
  };

  const isOrderCancelled = (orderData) => {
    return orderData?.orderStatus === 'CANCELLED';
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Responsive */}
      <div className='bg-white shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 flex items-center justify-between border-b border-gray-200'>
        <div className='flex items-center gap-2 sm:gap-3'>
          <FaBox className='text-lg sm:text-xl text-black' />
          <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-black'>My Orders</h1>
        </div>
      </div>

      {
        !order[0] && (
          <AnimatedImage/>
        )
      }
      
      {
        order.map((order,index)=>{
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
                
                {/* Product Image - Responsive */}
                <div className='flex-shrink-0 order-1 xl:order-2 w-full xl:w-auto flex justify-center xl:justify-start'>
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-lg overflow-hidden border-2 relative ${
                    isCancelled ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <img
                      src={order?.productDetails?.image[0]}
                      alt={order?.productDetails?.name}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isCancelled ? 'grayscale opacity-60' : ''
                      }`}
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
                        {/* Order Status Badge */}
                        {isCancelled ? (
                          <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-900 border-2 border-red-400">
                            ❌ Cancelled
                          </span>
                        ) : (
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                            order?.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {order?.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        )}
                        
                        {/* Cancel Order Button */}
                        {canCancelOrder(order) && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            disabled={cancellingOrderId === order._id}
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                              cancellingOrderId === order._id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                            }`}
                          >
                            {cancellingOrderId === order._id ? (
                              <div className='flex items-center gap-1'>
                                <div className='w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin'></div>
                                <span>Cancelling...</span>
                              </div>
                            ) : (
                              <>
                                <FaTimes className='inline w-3 h-3 mr-1' />
                                Cancel
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Name - Responsive */}
                  <div>
                    <h3 className={`text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 leading-tight ${
                      isCancelled ? 'text-red-800 line-through' : 'text-black'
                    }`}>
                      {order?.productDetails?.name}
                    </h3>
                    <div className={`h-0.5 w-12 sm:w-16 md:w-20 rounded-full ${
                      isCancelled ? 'bg-red-400' : 'bg-black'
                    }`}></div>
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
                          {order?.orderDate}
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
                </div>
              </div>
            </div>
          )
        })
      }

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <h3 className="text-lg font-semibold text-black">Cancel Order</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            
            <div className="border border-gray-200 rounded-lg p-3 mb-6 bg-gray-50">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Order:</span> {orderToCancel?.orderId}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Product:</span> {orderToCancel?.productDetails?.name}
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setOrderToCancel(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders