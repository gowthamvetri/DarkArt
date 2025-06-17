import React from 'react'
import { useSelector } from 'react-redux'
import AnimatedImage from '../components/NoData';

function MyOrders() {
  const order = useSelector((state) => state.order.orders);
  console.log(order);
  return (
    <div>
      <div className='bg-white shadow-md p-3 mb-4 flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Orders</h1>
      </div>
      {
        !order[0] && (
          <AnimatedImage/>
        )
      }
      {
        order.map((order,index)=>{
          return(
            <div key={order._id+index+"order"} className='bg-white shadow-md p-3 mb-4 flex items-center justify-between gap-4'>
              <div className='flex flex-col gap-4'>
                <p>Order No: {order.orderId}</p>
                <p className='text-lg font-semibold'>{order.productDetails.name}</p>
                <p>Address : {order.deliveryAddress.city}, {order.deliveryAddress.state}, {order.deliveryAddress.pincode}</p>
                <p>Payment : {order.paymentStatus}</p>
              </div>
              <div className='flex flex-col items-center justify-center hidden md:block'>
                <img src={order.productDetails.image[0]} alt={order.productDetails.name} className='w-32 h-32 object-cover mt-4' />
              </div>
            </div>
          )
        })
      }

    </div>
  )
}

export default MyOrders