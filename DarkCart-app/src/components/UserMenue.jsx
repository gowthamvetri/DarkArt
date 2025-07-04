import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosTostError from '../utils/AxiosTostError'
import { FiExternalLink, FiUser, FiShoppingBag, FiMapPin, FiSettings, FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import isAdmin from '../utils/isAdmin'

function UserMenue({close}) {
    const user = useSelector((state)=> state?.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async()=>{
        try {
            const response = await Axios({...SummaryApi.userLogOut})
            
            if(response.data.success){
                if(close){
                    close()
                }
                toast.success("Logged out successfully")
                dispatch(logout())
                localStorage.clear()
                navigate("/")
            }
        } catch (error) {
            AxiosTostError(error)       
        }
    }

    const handleClose = () =>{
        if(close){
            close()
        }
    }

    return (
        <div className="bg-white rounded-lg">
            {/* User Info Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                <div>
                    <h3 className="font-semibold text-gray-900">My Account</h3>
                    <p className="text-sm text-gray-600 truncate max-w-[180px]">
                        {user?.name || user?.email}
                    </p>
                    {user.role === "ADMIN" && (
                        <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-medium mt-1 inline-block">
                            Admin
                        </span>
                    )}
                </div>
                <Link to={"/dashboard/profile"} onClick={handleClose}>
                    <FiExternalLink size={16} className='text-gray-400 hover:text-black transition-colors'/>
                </Link>
            </div>

            <Divider/>

            {/* Regular User Menu */}
            <div className='text-sm grid gap-1'>
                <Link onClick={handleClose} to="/dashboard/myorders" className='flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors'>
                    <FiShoppingBag size={16} />
                    <span>My Orders</span>
                </Link>
                <Link onClick={handleClose} to="/dashboard/address" className='flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors'>
                    <FiMapPin size={16} />
                    <span>Saved Addresses</span>
                </Link>
            </div>

            {/* Admin Section */}
            {isAdmin(user.role) && (
                <>
                    <Divider/>
                    <div className="px-3 py-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Admin Panel
                        </span>
                    </div>
                    <div className='text-sm grid gap-1'>
                        <Link onClick={handleClose} to="/dashboard/category" className='flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors'>
                            <MdDashboard size={16} />
                            <span>Categories</span>
                        </Link>
                        <Link onClick={handleClose} to="/dashboard/subcategory" className='flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors'>
                            <MdDashboard size={16} />
                            <span>Sub Categories</span>
                        </Link>
                        <Link onClick={handleClose} to="/dashboard/product" className='flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors'>
                            <FiShoppingBag size={16} />
                            <span>Products</span>
                        </Link>
                        <Link onClick={handleClose} to="/dashboard/upload-product" className='flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors'>
                            <FiShoppingBag size={16} />
                            <span>Upload Product</span>
                        </Link>
                    </div>
                </>
            )}

            <Divider/>

            {/* Logout Button */}
            <div className="p-2">
                <button onClick={handleLogOut} className='flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors'>
                    <FiLogOut size={16} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default UserMenue