import React from 'react'
import { useSelector } from 'react-redux'
import AnimatedImage from '../components/NoData';

function MyOrders() {
  const order = useSelector((state) => state.order.orders);
  const user = useSelector((state) => state?.user);
  console.log(order);
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className='bg-white shadow-sm p-4 mb-6 flex items-center justify-between border-b border-gray-200'>
        <h1 className='text-xl font-bold text-gray-900 font-serif'>My Orders</h1>
      </div>
      {
        !order[0] && (
          <AnimatedImage/>
        )
      }
      {
        order.map((order,index)=>{
          return(
            <div key={order._id+index+"order"} className='bg-white shadow-sm hover:shadow-md transition-shadow p-6 mb-4 rounded-lg border border-gray-200 mx-4'>
              <div className='flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between'>
                <div className='flex-1 space-y-3'>
                  <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                    <p className='text-sm text-gray-600'>
                      <span className='font-medium'>Order No:</span> {order.orderId}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className='text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-4'>
                    <p className='font-medium'>Order by: {order?.userId.name}</p>
                    <p className='font-medium'>Email: {order?.userId.email}</p>
                  </div>
                  
                  <h3 className='text-lg font-semibold text-gray-900'>{order.productDetails.name}</h3>
                  
                  <div className='text-sm text-gray-600'>
                    <p className='mb-1'>
                      <span className='font-medium text-gray-700'>Delivery Address:</span>
                    </p>
                    <p>{order.deliveryAddress?.address_line}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state}, {order.deliveryAddress?.pincode}</p>
                  </div>
                </div>
                
                <div className='flex-shrink-0'>
                  <div className='w-24 h-24 lg:w-32 lg:h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-200'>
                    <img 
                      src={order.productDetails.image[0]} 
                      alt={order.productDetails.name} 
                      className='w-full h-full object-cover' 
                    />
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