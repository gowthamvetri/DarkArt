import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/noCart.jpg'
import toast from 'react-hot-toast'

const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice ,totalQty} = useGlobalContext()
    const cartItem  = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectToCheckoutPage = ()=>{
        if(user?._id){
            navigate("/checkout")
            if(close){
                close()
            }
            return
        }
        toast("Please Login")
    }
  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 bg-black/20 bg-opacity-70 z-50'>
        <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
            <div className='flex items-center p-4 shadow-md gap-3 justify-between border-b border-gray-200'>
                <h2 className='font-bold text-gray-900 font-serif text-lg'>Shopping Cart</h2>
                <Link to={"/"} className='lg:hidden text-gray-400 hover:text-gray-800 transition-colors'>
                    <IoClose size={25}/>
                </Link>
                <button onClick={close} className='hidden lg:block text-gray-400 hover:text-gray-800 transition-colors'>
                    <IoClose size={25}/>
                </button>
            </div>

            <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-gray-50 p-2 flex flex-col gap-4'>
                {/***display items */}
                {
                    cartItem[0] ? (
                        <>
                            <div className='flex items-center justify-between px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200'>
                                    <p className='font-medium'>Your total savings</p>
                                    <p className='font-semibold text-black'>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice )}</p>
                            </div>
                            <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto shadow-sm border border-gray-100'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item,index)=>{
                                                return(
                                                    <div key={item?._id+"cartItemDisplay"} className='flex w-full gap-4 pb-4 border-b border-gray-100 last:border-b-0'>
                                                        <div className='w-16 h-16 min-h-16 min-w-16 bg-gray-50 border border-gray-200 rounded-md overflow-hidden'>
                                                            <img
                                                                src={item?.productId?.image[0]}
                                                                className='object-cover w-full h-full'
                                                            />
                                                        </div>
                                                        <div className='w-full max-w-sm text-xs'>
                                                            <p className='text-sm text-ellipsis line-clamp-2 text-gray-900 font-medium'>{item?.productId?.name}</p>
                                                            <p className='text-gray-500'>{item?.productId?.unit}</p>
                                                            <p className='font-semibold text-black'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                                        </div>
                                                        <div>
                                                            <AddToCartButton data={item?.productId}/>
                                                        </div>
                                                    </div>
                                                )
                                            })
 
                                        )
                                    }
                            </div>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
                                <h3 className='font-semibold text-gray-900 mb-3'>Bill details</h3>
                                <div className='flex gap-4 justify-between ml-1 mb-2'>
                                    <p className='text-gray-600'>Items total</p>
                                    <p className='flex items-center gap-2'><span className='line-through text-gray-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span className='font-medium text-black'>{DisplayPriceInRupees(totalPrice)}</span></p>
                                </div>
                                <div className='flex gap-4 justify-between ml-1 mb-2'>
                                    <p className='text-gray-600'>Quantity total</p>
                                    <p className='flex items-center gap-2 text-black font-medium'>{totalQty} item</p>
                                </div>
                                <div className='flex gap-4 justify-between ml-1 mb-3 pb-3 border-b border-gray-200'>
                                    <p className='text-gray-600'>Delivery Charge</p>
                                    <p className='flex items-center gap-2 text-black font-medium'>Free</p>
                                </div>
                                <div className='font-semibold flex items-center justify-between gap-4'>
                                    <p className='text-gray-900'>Grand total</p>
                                    <p className='text-black text-lg'>{DisplayPriceInRupees(totalPrice)}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                      
                         <div className='bg-white flex flex-col justify-center items-center h-full py-5 rounded-lg shadow-sm'>
                         <img
                             src={imageEmpty}
                             alt="Empty Cart"
                             className='max-w-xs w-full h-auto object-contain'
                         />
                         <p className='text-gray-500 mt-4 text-center'>Your cart is empty</p>
                          <Link onClick={close} to={"/"} className='block bg-black hover:bg-gray-800 px-6 py-3 text-white rounded-md mt-4 font-medium tracking-wide transition-colors'>Shop Now</Link>
                     </div>
                    )
                }
                
            </div>

            {
                cartItem[0] && (
                    <div className='p-2'>
                        <div onClick={redirectToCheckoutPage} className='bg-black hover:bg-gray-800 text-white px-4 font-bold text-base py-4 static bottom-3 rounded-lg flex items-center gap-4 justify-between cursor-pointer transition-colors'>
                            <div>
                                {DisplayPriceInRupees(totalPrice)}
                            </div>
                            <button className='flex items-center gap-1 font-semibold tracking-wide'>
                                Proceed to Checkout
                                <span><FaCaretRight/></span>
                            </button>
                        </div>
                    </div>
                )
            }
            
        </div>
    </section>
  )
}

export default DisplayCartItem