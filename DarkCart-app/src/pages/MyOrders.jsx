import React from 'react'
import { useSelector } from 'react-redux'
import { FaMapMarkerAlt, FaCity, FaFlag, FaMailBulk, FaBox, FaUser, FaEnvelope } from 'react-icons/fa'
import AnimatedImage from '../components/NoData';

function MyOrders() {
  const order = useSelector((state) => state.order.orders);
  console.log(order);
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className='bg-white shadow-sm p-4 mb-6 flex items-center justify-between border-b border-gray-200'>
        <div className='flex items-center gap-3'>
          <FaBox className='text-xl text-black' />
          <h1 className='text-xl font-bold text-black'>My Orders</h1>
        </div>
      </div>

      {
        !order[0] && (
          <AnimatedImage/>
        )
      }
      
      {
        order.map((order,index)=>{
          return(
            <div key={order?._id+index+"order"} className='bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-4 mb-4 rounded-lg border border-gray-200 mx-4'>
              <div className='flex flex-col lg:flex-row gap-4 items-start'>
                
                {/* Product Image */}
                <div className='flex-shrink-0 order-1 lg:order-2'>
                  <div className='w-24 h-24 lg:w-32 lg:h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-200'>
                    <img
                      src={order?.productDetails?.image[0]}
                      alt={order?.productDetails?.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                </div>

                {/* Order Details */}
                <div className='flex-1 space-y-4 order-2 lg:order-1'>
                  
                  {/* Order Header */}
                  <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                    <div className='flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between'>
                      <div className='flex items-center gap-2'>
                        <FaBox className='text-black text-sm' />
                        <span className='text-sm font-medium text-gray-700'>Order No:</span>
                        <span className='text-sm font-bold text-black'>{order?.orderId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <h3 className='text-lg font-bold text-black mb-1'>{order?.productDetails?.name}</h3>
                    <div className='h-0.5 w-16 bg-black rounded-full'></div>
                  </div>
                  
                  {/* Customer Info */}
                  <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                    <h4 className='font-semibold text-black mb-2 flex items-center gap-2'>
                      <FaUser className='text-black text-sm' />
                      Customer Information
                    </h4>
                    <div className='space-y-1 ml-6'>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-700 font-medium'>Name:</span>
                        <span className='text-black font-semibold'>{order?.userId?.name}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <FaEnvelope className='text-black text-xs' />
                        <span className='text-gray-700 font-medium'>Email:</span>
                        <span className='text-gray-600'>{order?.userId?.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery Address */}
                  <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                    <div className='flex items-center gap-2 mb-3'>
                      <FaMapMarkerAlt className='text-black text-sm' />
                      <span className='font-semibold text-black'>Delivery Address</span>
                    </div>
                    <div className='space-y-2 ml-6'>
                      <div className='bg-white rounded-md p-2 border border-gray-200'>
                        <div className='flex items-start gap-2'>
                          <span className='text-gray-700 font-medium min-w-fit'>Street:</span>
                          <span className='text-black font-medium'>{order?.deliveryAddress?.address_line}</span>
                        </div>
                      </div>
                      
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className='bg-white rounded-md p-2 border border-gray-200'>
                          <div className='flex items-center gap-2'>
                            <FaCity className='text-black text-xs' />
                            <span className='text-gray-700 font-medium'>City:</span>
                            <span className='text-black font-medium'>{order?.deliveryAddress?.city}</span>
                          </div>
                        </div>
                        
                        <div className='bg-white rounded-md p-2 border border-gray-200'>
                          <div className='flex items-center gap-2'>
                            <span className='text-gray-700 font-medium'>State:</span>
                            <span className='text-black font-medium'>{order?.deliveryAddress?.state}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className='bg-white rounded-md p-2 border border-gray-200'>
                          <div className='flex items-center gap-2'>
                            <FaMailBulk className='text-black text-xs' />
                            <span className='text-gray-700 font-medium'>PIN:</span>
                            <span className='text-black font-medium'>{order?.deliveryAddress?.pincode}</span>
                          </div>
                        </div>
                        
                        <div className='bg-white rounded-md p-2 border border-gray-200'>
                          <div className='flex items-center gap-2'>
                            <FaFlag className='text-black text-xs' />
                            <span className='text-gray-700 font-medium'>Country:</span>
                            <span className='text-black font-medium'>{order?.deliveryAddress?.country}</span>
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
    </div>
  )
}

export default MyOrders