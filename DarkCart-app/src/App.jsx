import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import FetchUserInfo from './utils/FetchUserInfo';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setLoadingCategory } from './store/productSlice';

import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state)=> state?.user)

  const fetchUser = async () => {
    try{
      const response = await FetchUserInfo();
      dispatch(setUserDetails(response.data));
    }
    catch(error){
      toast.error("Failed to load user info! Please Login")
    }
  }

  const fetchCategory = async()=>{
    try {
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
    
    useEffect(()=>{
      fetchUser();
      fetchCategory();
  },[])

  return (
    <>
      <Header/>
      <main className='min-h-[78vh]'>
        <Outlet/>
      </main>
      <Footer/>
      <Toaster/>
    </>
  );
}
