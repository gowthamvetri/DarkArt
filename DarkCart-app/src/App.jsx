import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import FetchUserInfo from './utils/FetchUserInfo';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setLoadingCategory ,setAllSubCategory} from './store/productSlice';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi.js';
import GlobalProvider from './provider/GlobalProvider';
import CartMobileLink from './components/CartMobile.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';



export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state)=> state?.user)
  const location = useLocation();
  console.log(user)

  const fetchUser = async () => {
    try{
      const response = await FetchUserInfo();
      dispatch(setUserDetails(response.data));
    }
    catch(error){
      // navigate("/login");
    }
  }

  const fetchCategory = async()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryApi.getCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }
  const fetchSubCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }

    useEffect(()=>{
      fetchUser();
      fetchCategory();
      fetchSubCategory();
      // fetchCartItems();
  },[])

  return (
    <GlobalProvider>
      <Header/>
      <main className='min-h-[78vh]'>
        <ScrollToTop/>
        <Outlet/>
      </main>
      <Footer/>
      <Toaster/>
      {
        location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
    </GlobalProvider>
  );
}
