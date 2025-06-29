import { createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home';
import SearchPage from '../pages/SearchPage'; 
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import OtpVerify from '../pages/OtpVerify';
import ResetPassword from '../pages/ResetPassword';
import UserMenuMobile from '../pages/UserMenuMobile';
import Dashboard from '../layout/Dashboard';
import Profile from '../pages/Profile';
import MyOrders from '../pages/MyOrders';
import Address from '../pages/Address';
import CategoryPage from '../pages/CategoryPage';
import SubCategoryPage from '../pages/SubCategoryPage';
import UploadProduct from '../pages/UploadProduct';
import AdminPermision from '../layout/AdminPermission';
import ProductAdmin from '../pages/ProductAdmin';
import ProductListPage from '../pages/ProductListPage';
import ProductDisplayPage from '../pages/ProductDisplayPage';
import CartMobile from '../pages/CartMobile';
import CheckoutPage from '../pages/CheckoutPage';
import Success from '../pages/Success';
import Cancel from '../pages/Cancel';
import About from '../pages/About';

const router = createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        children: [
            {
                path:"/",
                element : <Home/>
            },
            {
                path:"/search",
                element : <SearchPage/>
            },
            {
                path:"/about",
                element : <About/>
            },
            {
                path:"/login",
                element : <Login/>
            },{
                path:"/register",
                element : <Register/>
            },{
                path:"/forget-password",
                element : <ForgotPassword/>
            },{
                path:"/otp-verification",
                element : <OtpVerify/>
            },{
                path:"/reset-password",
                element : <ResetPassword/>
            },{
                path:"/user-menu-mobile",
                element : <UserMenuMobile/>
            },{
                path:"/dashboard",
                element:<Dashboard/>,
                children :[{
                    path:"profile",
                    element:<Profile/>
                },{
                    path:"myorders",
                    element:<MyOrders/>
                },{
                    path:"address",
                    element:<Address/>
                },
                {
                    path:"category",
                    element:<AdminPermision><CategoryPage/></AdminPermision>
                },
                {
                    path:"subcategory",
                    element:<AdminPermision><SubCategoryPage/></AdminPermision>
                },
                {
                    path:"upload-product",
                    element:<AdminPermision><UploadProduct/></AdminPermision>
                },
                {
                    path:"product",
                    element:<AdminPermision><ProductAdmin/></AdminPermision>
                },
                
            ]
            },
            {
                path:":category",
                children :[
                    {
                        path:":subCategory",
                        element :<ProductListPage/>
                    }
                ]
            },{
                path:"product/:product",
                element :<ProductDisplayPage />
            },
            {
                path : 'cart',
                element : <CartMobile/>
            },
            {
                path:"checkout",
                element: <CheckoutPage/>
            },
            {
                path:"success",
                element : <Success/>
            },
            {
                path:"cancel",
                element : <Cancel/>
            }
        ]
    }
])

export default router;